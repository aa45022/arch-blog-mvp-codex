import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { checkOrigin } from "@/lib/auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!checkOrigin(request)) {
    return NextResponse.json({ error: "來源不允許" }, { status: 403 });
  }

  try {
    const { email, password, rememberMe } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "請輸入帳號和密碼" }, { status: 400 });
    }

    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "帳號或密碼錯誤" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "帳號或密碼錯誤" }, { status: 401 });
    }

    // 清除舊 session
    await prisma.session.deleteMany({ where: { adminUserId: user.id } });

    const token = randomBytes(32).toString("hex");
    // 記住我 = 30天；否則 24小時
    const days = rememberMe ? 30 : 1;
    const expiresAt = new Date(Date.now() + days * 86400 * 1000);

    await prisma.session.create({
      data: { token, adminUserId: user.id, expiresAt },
    });

    const cookieStore = await cookies();
    cookieStore.set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: days * 86400,
    });

    return NextResponse.json({ data: { email: user.email } });
  } catch {
    return NextResponse.json({ error: "登入時發生錯誤" }, { status: 500 });
  }
}
