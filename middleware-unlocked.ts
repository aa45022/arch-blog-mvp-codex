import { NextRequest, NextResponse } from "next/server";

/**
 * ⚠️ 無鎖版 Middleware — 僅供測試環境使用
 * 所有後台頁面無需登入即可存取
 * 正式環境請用原版 middleware.ts
 */
export function middleware(_request: NextRequest) {
  // 全部放行，不做任何認證檢查
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
