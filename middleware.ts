import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 登入頁：檢查秘密參數
  if (pathname === "/admin/login") {
    const secret = process.env.ADMIN_SECRET;
    // 有設定 ADMIN_SECRET 時，必須帶 ?key=xxx 才放行
    if (secret && request.nextUrl.searchParams.get("key") !== secret) {
      return NextResponse.rewrite(new URL("/not-found", request.url));
    }
    return NextResponse.next();
  }

  // 其他 /admin/* 路由：檢查 session
  const sessionToken = request.cookies.get("session_token")?.value;

  if (!sessionToken) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};