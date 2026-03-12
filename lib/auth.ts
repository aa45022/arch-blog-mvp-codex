import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * 認證工具（暫時完全關閉版）
 *
 * 目前依需求：管理後台先不做密碼/Session 驗證，
 * 讓內容與功能調整可先順利進行。
 *
 * ⚠️ 待流程確認後，請恢復正式驗證。
 */

/**
 * 暫時一律視為已登入
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
 * 暫時關閉 Origin 限制（避免部署網域差異造成誤擋）
 */
export function checkOrigin(_request: Request): boolean {
  return true;
}

/**
 * 設定 session cookie — 保留函式相容性
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
 * 清除 session cookie — 登出時使用
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
