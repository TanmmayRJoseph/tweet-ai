import { NextRequest, NextResponse } from "next/server";
import ai from "@/utils/gemini";
import { tweets } from "@/db/schema";
import db from "@/db/drizzle";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    // 1. Parse request body
    const { mood } = await req.json();

    if (!mood || !["funny", "sarcastic", "motivational"].includes(mood)) {
      return NextResponse.json(
        { error: "Invalid or missing mood." },
        { status: 400 }
      );
    }

    // 2. Extract JWT from Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // 3. Verify and decode JWT
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    } catch (err) {
      console.error("Token verification error:", err);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.id;

    // 4. Generate longer tweet (~200 words) using Gemini
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt = `Write a ${mood} Twitter-style post or thread that is around 200 words. Make it feel like something someone would actually tweet — engaging, punchy, and potentially viral. You can use emojis, line breaks, and relatable scenarios.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const tweetText = response.text().replace(/\n/g, " ").trim();

    if (!tweetText || tweetText.length < 100) {
      return NextResponse.json(
        { error: "Failed to generate a valid tweet." },
        { status: 500 }
      );
    }

    // 5. Insert tweet into DB with userId
    await db.insert(tweets).values({
      text: tweetText,
      mood,
      userId,
    });

    // 6. Return tweet in response
    return NextResponse.json({ tweet: tweetText });
  } catch (err) {
    console.error("Tweet generation error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
