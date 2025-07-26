import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { tweets } from "@/db/schema";
import db from "@/db/drizzle";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function DELETE(req: NextRequest) {
  try {
    // 1. Get tweet ID from URL
    const url = new URL(req.url);
    const parts = url.pathname.split("/");
    const tweetId = parts[parts.length - 1];

    if (!tweetId) {
      return NextResponse.json({ error: "Missing tweet ID" }, { status: 400 });
    }

    // 2. Extract and verify JWT
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    } catch (err) {
      console.error("Something went wrong", err);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.id;

    // 3. Check if the tweet belongs to the user
    const tweet = await db
      .select()
      .from(tweets)
      .where(eq(tweets.id, Number(tweetId)));

    if (!tweet.length || tweet[0].userId !== userId) {
      return NextResponse.json({ error: "Tweet not found or unauthorized" }, { status: 403 });
    }

    // 4. Delete the tweet
    await db.delete(tweets).where(eq(tweets.id, Number(tweetId)));

    return NextResponse.json({ message: "Tweet deleted successfully" });
  } catch (err) {
    console.error("Delete tweet error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
