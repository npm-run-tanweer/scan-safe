import { NextResponse } from "next/server";
import Scan from "@/models/scan";
import User from "@/models/user";
import { gemini } from "@/lib/gemini";
import { connectDB } from "@/lib/mongo";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { barcode } = params;
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get("user");
    console.log(clerkId)

   if (!clerkId) {
      return NextResponse.json({ error: "Missing clerkId" }, { status: 400 });
    }

    // Find user by Clerk ID
    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch product data" },
        { status: res.status }
      );
    }

    const productData = await res.json();
    const product = productData.product;

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const productObj = {
      name: product.product_name,
      brand: product.brands,
      ingredients: product.ingredients_text,
      allergens: product.allergens_tags,
      nutriments: {
        sugar: product.nutriments?.sugars_100g,
        carbs: product.nutriments?.carbohydrates_100g,
        calories: product.nutriments?.["energy-kcal_100g"],
        fat: product.nutriments?.fat_100g,
      },
      diet_labels: product.labels_tags,
      analysis: product.ingredients_analysis_tags,
      nutriscore: product.nutriscore_grade,
      nova: product.nova_group,
    };

    // const user = await User.findById(userId);
    // if (!user) {
    //   return NextResponse.json({ error: "User not found" }, { status: 404 });
    // }

    // const prompt = `
    //   A user with these conditions:
    //   - Age: ${user.age}
    //   - Region: ${user.region}
    //   - Known allergies: ${user.allergens || "none"}
    //   - Known conditions: ${user.conditions || "none"}
    //   - Allergy severity: ${user.allergyLevel}
    //   - isVegan: ${user.isVegan}

    //   Product info: ${JSON.stringify(productObj)}

    //   Task: Decide if this product is SAFE or UNSAFE for the user based on their condition/allergy.
    //   You are an API. Return ONLY strictly valid JSON. No code blocks, no markdown.
    //   {
    //     "status": "safe" | "unsafe" | "unknown",
    //     "reason": "short explanation in few words",
    //     "score": "an out of 10 rating on how much the product is safe"
    //     "riskIngredients": [array of risky ingredients],
    //     "nutritionFlags": [array of concerns about sugar, carbs, fat, calories]
    //   }
    // `;

    const prompt = `
      You are a strict health risk evaluator API. 
      Your job: decide if a product is SAFE or UNSAFE for a user based on their medical conditions and allergies.

      User Profile:
      - Age: ${user.age}
      - Region: ${user.region}
      - Known allergies: ${user.allergens || "none"}
      - Known conditions: ${user.conditions || "none"}
      - Allergy severity: ${user.allergyLevel}
      - Vegan: ${user.isVegan}

      Product Info (JSON): ${JSON.stringify(productObj)}

      Rules:
      1. If product contains an allergen listed for the user → "unsafe".
      2. If user is diabetic → flag products with high sugar (>5g/100g) or high carbs (>15g/100g) as "unsafe".
      3. If user has celiac → gluten or wheat in ingredients = "unsafe".
      4. If vegan and product contains animal products → "unsafe".
      5. Otherwise, assess nutrition risks (sugar, fat, calories) and rate accordingly.

      Return ONLY valid JSON (no code blocks, no markdown). Strictly follow this schema:
      {
        "status": "safe" | "unsafe" | "unknown",
        "reason": "short clear explanation",
        "score": number (1-10),
        "riskIngredients": [list of risky ingredients],
        "nutritionFlags": [list of nutritional concerns about sugar, carbs, fat, calories]
      }
`;

    const result = await gemini.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let geminiJson;
    try {
      geminiJson = JSON.parse(cleaned);
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid response from Gemini", raw: text },
        { status: 500 }
      );
    }

    // console.log("HEH ........ ",geminiJson)
    const newScan = await Scan.create({
      userId:user._id,
      barcode,
      productName: product.product_name,
      brand: product.brands,
      nutriscore: product.nutriscore_grade,
      analysisResult: {
        status: geminiJson.status,
        reason: geminiJson.reason,
        score: geminiJson.score,
        riskIngredients: geminiJson.riskIngredients || [],
        nutritionFlags: geminiJson.nutritionFlags || [],
      },
    });

    return NextResponse.json(newScan);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
