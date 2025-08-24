import { connectDB } from "@/lib/mongo";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { gemini } from "@/lib/gemini";
export async function POST(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get("userId");

    if (!clerkId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const body = await req.json();
    const { category} = body;

    if (!category) {
      return NextResponse.json({ error: "Missing category" }, { status: 400 });
    }

    console.log("Searching for category:", category); // Debug log

    // Find user by Clerk ID
    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }


    console.log("Found user with allergens:", user.allergens); // Debug log

    // console.log("Category: ", category)
    const forbiddenIngredients = user.allergens;
    const baseUrl = "https://world.openfoodfacts.org/api/v2/search";
    const params = new URLSearchParams({
      categories_tags: category?.toLowerCase(),
      countries_tags: "en:india",
      page_size: "100",
    });

    const url = `${baseUrl}?${params.toString()}`;
    console.log("Fetching from URL:", url); // Debug log

    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      console.error("OpenFoodFacts API error:", data);
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 502 }
      );
    }

    // Filter products
    const filtered = data.products
      .filter((product) => product.ingredients_text)
      .filter((product) => {
        const ingredients = product.ingredients_text.toLowerCase();
        return !forbiddenIngredients.some((ing) =>
          ingredients.includes(ing.toLowerCase())
        );
      })
      .map((product) => ({
        name: product.product_name,
        nutriscore: product.nutriscore_grade,
      }));

    const prompt = `
You are given a JSON array of product objects:

${JSON.stringify(filtered)}

Each product may have many keys like 
"product_name", "nutriscore_grade", "categories_tags", etc. 

Task:
- Filter out all products that do NOT contain any of these "${forbiddenIngredients}" 
- From the remaining products, return only the keys:
  - "name" → mapped from "product_name"
  - "nutriscore" → mapped from "nutriscore_grade"

Output format:
Return the final result strictly as a JSON array of objects with this structure:
[
  { "name": "string", "nutriscore": "string" },
  { "name": "string", "nutriscore": "string" }...
]

Do not include any explanation, only the JSON.`;

    const result = await gemini.generateContent(prompt);
    const text = result.response.text();

    // Remove code fences and extra text
    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Try parsing into JSON
    let geminiJson;
    try {
      geminiJson = JSON.parse(cleaned);
    } catch (err) {
      console.error("Gemini returned invalid JSON:", text);
      return NextResponse.json(
        { error: "Invalid response from Gemini", raw: text },
        { status: 500 }
      );
    }

    // console.log(geminiJson);
    const filterByScore = geminiJson
      .filter((p) => ["a", "b"].includes(p.nutriscore.toLowerCase()))
      .sort((p1, p2) => {
        if (p1.nutriscore === p2.nutriscore) return 0;
        return p1.nutriscore === "a" ? -1 : 1;
      })
      .slice(0, 5);
    // console.log(filtered);
    return NextResponse.json({
      products: filterByScore,
      total: filterByScore.length,
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
