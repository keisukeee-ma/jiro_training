import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const SESSION_COOKIE = "jiro_admin_session";

const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24, // 24時間
  path: "/",
};

/**
 * NextResponse に直接セッションCookieを書き込む。
 * Route Handler ではこの方式が最も確実 (cookies().set() は環境により発行されないことがある)。
 */
export function attachSessionCookie(response: NextResponse): NextResponse {
  const token = crypto.randomUUID();
  response.cookies.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
  return response;
}

/**
 * Server Action や Server Component 用 (cookies() ベース)。
 */
export async function createSession(): Promise<string> {
  const token = crypto.randomUUID();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
  return token;
}

export async function verifySession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  return !!session?.value;
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export function clearSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set(SESSION_COOKIE, "", { ...SESSION_COOKIE_OPTIONS, maxAge: 0 });
  return response;
}

export async function requireAuth(): Promise<NextResponse | null> {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
