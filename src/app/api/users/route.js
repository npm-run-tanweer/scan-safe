import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import User from "@/models/user";

export async function GET() {
  await connectDB();
  const users = await User.find();
  return NextResponse.json(users);
}

export async function POST(req) {
  await connectDB();
  const { name, age, region, clerkId, allergens, conditions, isVegan, allergyLevel } = await req.json();

  const updatedUser = await User.findOneAndUpdate(
    { clerkId }, 
    { name, age, region, clerkId, allergens, conditions, isVegan, allergyLevel },
    { new: true, upsert: true }
  );

  return NextResponse.json(updatedUser);
}
