import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { category, country, forbiddenIngredients } = await req.json();

    const baseUrl = "https://world.openfoodfacts.org/api/v2/search";
    const params = new URLSearchParams({  
      categories_tags: `en:${category}`,
      countries_tags: `en:${country || "india"}`,
      page_size: "100"
    });

    const url = `${baseUrl}?${params.toString()}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Failed to fetch from OFF: ${res.status}`);
    }

    const data = await res.json();

    // Keep only products with ingredients_text
    const filtered = data.products
      .filter((product) => product.ingredients_text)
      .filter((product) => {
        const ingredients = product.ingredients_text.toLowerCase();
        return !forbiddenIngredients.some((ing) =>
          ingredients.includes(ing.toLowerCase())
        );
      })
      .map((product) => product.product_name || "Unnamed Product");

    return NextResponse.json({
      products: filtered,
      url,
      originalCount: data.products.length,
      filteredCount: filtered.length,
    });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
