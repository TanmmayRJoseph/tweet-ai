// /api/get-user-tweets/route.ts

import { NextRequest, NextResponse } from "next/server";
import { tweets } from "@/db/schema";
import db from "@/db/drizzle";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  try {
    // 1. Get token from Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    } catch (err) {
      console.error("Token verification error:", err);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.id;

    // 3. Query tweets for the specific user
    const userTweets = await db.query.tweets.findMany({
      where: (tweet, { eq }) => eq(tweet.userId, userId),
    });

    return NextResponse.json(userTweets);
  } catch (error) {
    console.error("Error fetching user tweets:", error);
    return NextResponse.json(
      { error: "Failed to fetch tweets" },
      { status: 500 }
    );
  }
}
