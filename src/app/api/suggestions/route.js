import { connectDB } from "@/lib/mongo";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get("userId");
    
    if (!clerkId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const body = await req.json();
    const { category } = body;

    if (!category) {
      return NextResponse.json({ error: "Missing category" }, { status: 400 });
    }

    console.log('Searching for category:', category); // Debug log

    // Find user by Clerk ID
    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log('Found user with allergens:', user.allergens); // Debug log

    const forbiddenIngredients = user.allergens;
    const baseUrl = "https://world.openfoodfacts.org/api/v2/search";
    const params = new URLSearchParams({
      categories_tags: category.toLowerCase(),
      countries_tags: "en:india",
      page_size: "100",
    });

    const url = `${baseUrl}?${params.toString()}`;
    console.log('Fetching from URL:', url); // Debug log

    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      console.error('OpenFoodFacts API error:', data);
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 502 });
    }

    // Filter products
    const filtered = data.products
      .filter(product => product.ingredients_text)
      .filter(product => {
        const ingredients = product.ingredients_text.toLowerCase();
        return !forbiddenIngredients.some(ing => 
          ingredients.includes(ing.toLowerCase())
        );
      })
      .map(product => product.product_name || "Unnamed Product");

    console.log(`Found ${filtered.length} matching products`); // Debug log

    return NextResponse.json({
      products: filtered,
      total: filtered.length
    });

  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
