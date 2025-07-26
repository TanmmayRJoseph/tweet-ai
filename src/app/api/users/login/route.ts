import { NextRequest, NextResponse } from "next/server";
import { users } from "@/db/schema";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "@/db/drizzle";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.email, email),
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" } // Valid for 7 days
    );

    const response = NextResponse.json({
      token,
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email },
    });

    // ✅ Set JWT cookie (HttpOnly for security)
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("[LOGIN_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
