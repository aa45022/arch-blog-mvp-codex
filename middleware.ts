import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Next.js Middleware — 保護 /admin/* 路由
 * 職責：cookie 有無檢查（不碰 DB）
 * 真驗證在 lib/auth.ts (validateSession)
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 排除 /admin/login — 登入頁不需要驗證
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // 檢查 session_token cookie
  const sessionToken = request.cookies.get("session_token")?.value;

  if (!sessionToken) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// 只攔截 /admin/* 路由
export const config = {
  matcher: ["/admin/:path*"],
};
