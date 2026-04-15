import { NextRequest, NextResponse } from "next/server";
import { attachSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "パスワードが正しくありません" }, { status: 401 });
  }

  // NextResponse に直接 Set-Cookie を書き込む
  const response = NextResponse.json({ success: true });
  return attachSessionCookie(response);
}
