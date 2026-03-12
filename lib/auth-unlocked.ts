import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * ⚠️ 無鎖版認證 — 僅供測試環境使用
 * validateSession() 永遠回傳一個假的管理員
 * checkOrigin() 永遠放行
 * 正式環境請用原版 auth.ts
 */

export async function validateSession() {
  // 嘗試正常驗證，失敗就回傳假管理員
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (token) {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { adminUser: { select: { id: true, email: true } } },
    });
    if (session && session.expiresAt > new Date()) {
      return { adminUser: session.adminUser, session };
    }
  }

  // 無 session 也放行 — 回傳假管理員
  return {
    adminUser: { id: 0, email: "test@sitelab.dev" },
    session: null,
  };
}

export function checkOrigin(_request: Request): boolean {
  // 全部放行
  return true;
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 86400 * 365,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set("session_token", "", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
