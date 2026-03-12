import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * 認證工具（暫時全面停用）
 * 依目前需求：管理端先不使用密碼驗證，方便快速進行內容調整。
 */

/**
 * 驗證 Session（暫時直接放行）
 */
export async function validateSession() {
  return {
    adminUser: { id: 0, email: "admin@local" },
    session: {
      id: 0,
      token: "auth-disabled",
      expiresAt: new Date(Date.now() + 86400 * 1000),
      adminUserId: 0,
    },
  };
}

/**
 * 檢查 Origin（保留原有行為）
 */
export function checkOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");

  // 沒有 Origin header（例如 same-origin GET）→ 放行
  if (!origin) return true;

  const requestOrigin = new URL(request.url).origin;

  const allowedOrigins = [
    requestOrigin,
    process.env.APP_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.ZEABUR_URL ? `https://${process.env.ZEABUR_URL}` : undefined,
  ]
    .filter(Boolean)
    .map((value) => {
      try {
        return new URL(String(value)).origin;
      } catch {
        return String(value).replace(/\/$/, "");
      }
    });

  return allowedOrigins.includes(origin);
}

/**
 * 設定 session cookie — 保留給相容流程
 */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 86400,
  });
}

/**
 * 清除 session cookie
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set("session_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
