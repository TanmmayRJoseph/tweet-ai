import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { tweets } from "@/db/schema";
import db from "@/db/drizzle";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  try {
    // 1. Extract and verify JWT
    const authHeader = req.headers.get("Authorization");
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

    // 2. Parse query param (mood)
    const { searchParams } = new URL(req.url);
    const mood = searchParams.get("mood");

    let userTweets;

    // 3. Query DB (filter if mood is present)
    if (mood && ["funny", "sarcastic", "motivational"].includes(mood)) {
      userTweets = await db
        .select()
        .from(tweets)
        .where(and(eq(tweets.userId, userId), eq(tweets.mood, mood)));
    } else {
      userTweets = await db
        .select()
        .from(tweets)
        .where(eq(tweets.userId, userId));
    }

    // 4. Return tweets
    return NextResponse.json({ tweets: userTweets });
  } catch (err) {
    console.error("Fetch tweets error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
