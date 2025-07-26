/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import db from "@/db/drizzle";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  try {
    // 1. Get token from cookies
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token" },
        { status: 401 }
      );
    }

    // 2. Verify token
    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      console.error("[ME_ROUTE_ERROR]", err);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const userId = payload.id;

    // 3. Query user from DB
    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, userId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 4. Return user info (you can filter fields if needed)
    return NextResponse.json({ user });
  } catch (error) {
    console.error("[ME_ROUTE_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}