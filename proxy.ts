import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Middleware（Proxy 角色）— 保護 /admin/* 路由
 *
 * Next.js 16 以 proxy.ts 概念取代舊 middleware，
 * 但實際入口檔仍為 middleware.ts（框架預設搜尋位置）。
 *
 * 職責：
 *   - 攔截 /admin/* 路由（排除 /admin/login）
 *   - 無 session_token cookie → redirect /admin/login
 *   - 有 cookie → 放行（不查 DB）
 *   - 不做任何 DB 操作
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 排除 /admin/login — 登入頁不需要驗證
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // 檢查 cookie 中有無 session_token
  const sessionToken = request.cookies.get("session_token")?.value;

  if (!sessionToken) {
    // 無 cookie → redirect 到登入頁
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 有 cookie → 放行（真驗證交給 Route Handlers + lib/auth.ts）
  return NextResponse.next();
}

// 只攔截 /admin/* 路由，不影響前台和 API
