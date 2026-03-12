import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * 認證工具 — Session 真驗證 + Origin 檢查
 *
 * 所有 Route Handlers 用這裡做真驗證，
 * middleware.ts 只做 cookie 有無檢查（不碰 DB）。
 */

/**
 * 驗證 Session — 從 cookie 取 token → 查 DB → 檢查過期
 *
 * @returns { adminUser, session } | null
 */
export async function validateSession() {
  const authDisabled = process.env.ADMIN_AUTH_DISABLED !== "false";
  if (authDisabled) {
    return {
      adminUser: { id: 0, email: "dev@local" },
      session: { id: 0, token: "auth-disabled", expiresAt: new Date(Date.now() + 86400 * 1000), adminUserId: 0 },
    };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) return null;

  // 查 DB：Session 是否存在
  const session = await prisma.session.findUnique({
    where: { token },
    include: { adminUser: { select: { id: true, email: true } } },
  });

  if (!session) return null;

  // 檢查是否過期
  if (session.expiresAt < new Date()) {
    // 過期 → 刪除 Session 記錄
    await prisma.session.delete({ where: { id: session.id } });
    return null;
  }

  return {
    adminUser: session.adminUser,
    session,
  };
}

/**
 * 檢查 Origin — 比對 request header Origin vs APP_URL
 * 寫入 API（POST/PUT/DELETE/PATCH）才需要呼叫
 *
 * @returns true = 通過 / false = 不符（回 403）
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
 * 設定 session cookie — 登入成功時使用
 */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 86400, // 24 小時
  });
}

/**
 * 清除 session cookie — 登出時使用
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set("session_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0, // 立即過期
  });
}
