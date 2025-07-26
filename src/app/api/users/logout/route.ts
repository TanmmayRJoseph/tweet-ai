import { NextResponse } from "next/server";

export async function POST() {
  // Create response and clear the token cookie
  const response = NextResponse.json({ message: "Logout successful" });

  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0, // 👈 expires the cookie immediately
  });

  return response;
}