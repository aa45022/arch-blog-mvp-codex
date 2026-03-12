import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { checkOrigin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!checkOrigin(request)) {
    return NextResponse.json({ error: "來源不允許" }, { status: 403 });
  }

  try {
    const { email, password, setupKey } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "請輸入 Email 與密碼" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "密碼至少需 8 碼" }, { status: 400 });
    }

    const requiredSetupKey = process.env.ADMIN_SETUP_KEY;
    if (requiredSetupKey && setupKey !== requiredSetupKey) {
      return NextResponse.json({ error: "初始化金鑰錯誤" }, { status: 403 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const adminCount = await prisma.adminUser.count();
    const hashedPassword = await bcrypt.hash(password, 12);

    // 首次初始化：建立第一組管理員
    if (adminCount === 0) {
      const admin = await prisma.adminUser.create({
        data: {
          email: normalizedEmail,
          password: hashedPassword,
        },
        select: { id: true, email: true },
      });

      return NextResponse.json({ data: admin, mode: "created" }, { status: 201 });
    }

    // 已有管理員時，僅允許在設定 ADMIN_SETUP_KEY 後做密碼重設
    if (!requiredSetupKey) {
      return NextResponse.json({ error: "管理員已存在。若忘記密碼，請先在環境變數設定 ADMIN_SETUP_KEY，並在此頁輸入後重設。" }, { status: 409 });
    }

    if (setupKey !== requiredSetupKey) {
      return NextResponse.json({ error: "初始化金鑰錯誤" }, { status: 403 });
    }

    const existingAdmin = await prisma.adminUser.findUnique({ where: { email: normalizedEmail } });
    if (!existingAdmin) {
      return NextResponse.json({ error: "找不到此管理員 Email，請輸入既有管理員帳號。" }, { status: 404 });
    }

    const updated = await prisma.adminUser.update({
      where: { id: existingAdmin.id },
      data: { password: hashedPassword },
      select: { id: true, email: true },
    });

    return NextResponse.json({ data: updated, mode: "reset" }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "建立管理員失敗";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
