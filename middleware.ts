import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * 暫時關閉管理端防護，且避免停留在 login/setup。
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login" || pathname === "/admin/setup") {
    return NextResponse.redirect(new URL("/admin/posts", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
