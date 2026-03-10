import { NextResponse } from "next/server";
import { validateSession, clearSessionCookie } from "@/lib/auth";

/**
 * POST /api/logout — 管理員登出
 *
 * 刪除 DB Session → 清除 cookie
 */
export async function POST() {
  try {
    const auth = await validateSession();

    if (auth) {
      // 刪除 DB 中的 Session 記錄
      const { prisma } = await import("@/lib/prisma");
      await prisma.session.delete({
        where: { id: auth.session.id },
      });
    }

    // 清除 cookie（即使驗證失敗也清除）
    await clearSessionCookie();

    return NextResponse.json({
      data: { message: "已登出" },
    });
  } catch {
    // 清除 cookie
    await clearSessionCookie();

    return NextResponse.json({
      data: { message: "已登出" },
    });
  }
}
