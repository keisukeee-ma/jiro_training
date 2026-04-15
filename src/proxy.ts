import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin/login はスキップ
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // /admin 以下の認証チェック
  if (pathname.startsWith("/admin")) {
    const session = request.cookies.get("jiro_admin_session");
    if (!session?.value) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
