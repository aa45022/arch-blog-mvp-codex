import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * 暫時停用後台路由防護（依目前需求）
 * 等整體功能確認完成後再恢復。
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
