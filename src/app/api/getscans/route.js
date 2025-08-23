import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Scan from "@/models/scan";
import User from "@/models/user";
import mongoose from "mongoose";
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get("userId");

    if (!clerkId) {
      return NextResponse.json({ error: "Missing clerkId" }, { status: 400 });
    }

    // Find user by Clerk ID
    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // console.log(user);
    // const userId = new mongoose.Types.ObjectId(user._id);
    // const scans = await Scan.find({userId}).sort({ createdAt: -1 });
    // const scans = await Scan.find({ userId: new mongoose.Types.ObjectId(user._id) }).sort({ createdAt: -1 });

    // const scans = await Scan.find();
    const scans = await Scan.find({ userId: user._id }).sort({ createdAt: -1 });

    console.log(scans);

    console.log(
      "User._id:",
      user._id,
      typeof user._id,
      user._id instanceof mongoose.Types.ObjectId
    );

    const scan = await Scan.findOne();
    console.log(
      "Scan.userId:",
      scan.userId,
      typeof scan.userId,
      scan.userId instanceof mongoose.Types.ObjectId
    );

    return NextResponse.json({ scans });
  } catch (error) {
    console.error("Error fetching scans:", error);
    return NextResponse.json(
      { error: "Failed to fetch scans" },
      { status: 500 }
    );
  }
}
