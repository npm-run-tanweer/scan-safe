import { NextResponse } from "next/server";

export async function GET(
  req,
  { params }
) {
  try {
    const { barcode } = params;

    const res = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch product data" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
