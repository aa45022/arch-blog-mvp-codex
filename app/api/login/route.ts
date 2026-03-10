import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/auth";
import bcrypt from "bcrypt";
import crypto from "crypto";

/**
 * POST /api/login — 管理員登入
 *
 * Request body: { email: string, password: string }
 * 成功: { data: { email } } + Set-Cookie
 * 失敗: { error: "帳號或密碼錯誤" }（不區分帳號/密碼）
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 基本驗證
    if (!email || !password) {
      return NextResponse.json(
        { error: "請輸入帳號和密碼" },
        { status: 400 }
      );
    }

    // 查詢管理員
    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    // 帳號不存在 → 統一錯誤訊息（不區分帳號/密碼）
    if (!admin) {
      return NextResponse.json(
        { error: "帳號或密碼錯誤" },
        { status: 401 }
      );
    }

    // 比對密碼
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "帳號或密碼錯誤" },
        { status: 401 }
      );
    }

    // 清除該管理員的舊 session（避免 DB 累積）
    await prisma.session.deleteMany({
      where: { adminUserId: admin.id },
    });

    // 產生 session token
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 86400 * 1000); // 24 小時後

    // 寫入 DB
    await prisma.session.create({
      data: {
        token,
        expiresAt,
        adminUserId: admin.id,
      },
    });

    // 設定 cookie
    await setSessionCookie(token);

    return NextResponse.json({
      data: { email: admin.email },
    });
  } catch {
    // 不外洩原始錯誤
    return NextResponse.json(
      { error: "登入時發生錯誤" },
      { status: 500 }
    );
  }
}
