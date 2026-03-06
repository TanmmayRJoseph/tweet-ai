import { NextRequest, NextResponse } from "next/server";
import ai from "@/utils/gemini";
import { tweets } from "@/db/schema";
import db from "@/db/drizzle";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { MOOD_PROMPTS, VALID_MOODS } from "@/constants/moods";
import type { Mood } from "@/constants/moods";
// ─── Constants ────────────────────────────────────────────────────────────────

const JWT_SECRET = process.env.JWT_SECRET!;

// Validate at cold-start, not per-request — fail fast if misconfigured
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set.");
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Extracts and verifies the Bearer JWT from the Authorization header.
 * Returns the decoded payload or throws a typed error.
 */
function extractUserId(req: NextRequest): string {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    throw Object.assign(
      new Error("Missing or malformed Authorization header"),
      {
        status: 401,
      },
    );
  }

  const token = authHeader.slice(7); // faster than split(" ")[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    if (!decoded?.id || typeof decoded.id !== "string") {
      throw new Error("Token payload missing id field");
    }

    return decoded.id;
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw Object.assign(new Error("Token has expired"), { status: 401 });
    }
    if (err instanceof JsonWebTokenError) {
      throw Object.assign(new Error("Invalid token"), { status: 401 });
    }
    throw err;
  }
}

/**
 * Calls Gemini and returns the generated tweet text.
 * Throws if the output is too short or empty.
 */
async function generateTweet(mood: Mood): Promise<string> {
  const model = ai.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    generationConfig: {
      // Constrain randomness slightly for more consistent quality
      temperature: 0.85,
      maxOutputTokens: 300,
    },
  });

  const result = await model.generateContent(MOOD_PROMPTS[mood]);
  const text = result.response.text().replace(/\n/g, " ").trim();

  if (!text || text.length < 100) {
    throw Object.assign(new Error("AI returned insufficient content"), {
      status: 502, // Bad Gateway — upstream (Gemini) issue, not your server
    });
  }

  return text;
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // 1. Parse & validate body
  let mood: string;
  try {
    ({ mood } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!mood || !VALID_MOODS.has(mood as Mood)) {
    return NextResponse.json(
      {
        error: "Invalid or missing mood.",
        validOptions: [...VALID_MOODS],
      },
      { status: 400 },
    );
  }

  // 2. Authenticate
  let userId: string;
  try {
    userId = extractUserId(req);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Unauthorized" },
      { status: err.status ?? 401 },
    );
  }

  // 3. Generate tweet + persist — run concurrently where possible
  let tweetText: string;
  try {
    tweetText = await generateTweet(mood as Mood);
  } catch (err: any) {
    console.error("[tweet/generate] Gemini error:", err);
    return NextResponse.json(
      { error: err.message ?? "Failed to generate tweet." },
      { status: err.status ?? 500 },
    );
  }

  // 4. Persist to DB
  try {
    await db.insert(tweets).values({ text: tweetText, mood, userId });
  } catch (err) {
    // Log but don't expose DB internals to client
    console.error("[tweet/generate] DB insert error:", err);
    return NextResponse.json(
      { error: "Failed to save tweet. Please try again." },
      { status: 500 },
    );
  }

  // 5. Return
  return NextResponse.json({ tweet: tweetText }, { status: 201 });
}
