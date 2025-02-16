import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { sign } = await request.json()

  // Save the sign in a cookie
  cookies().set("zodiac_sign", sign, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  })

  return NextResponse.json({ success: true })
}

