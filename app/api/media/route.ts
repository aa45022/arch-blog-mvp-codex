import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSession, checkOrigin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await validateSession();
  if (!auth) return NextResponse.json({ error: "未登入" }, { status: 401 });

  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ data: media });
  } catch {
    return NextResponse.json({ error: "讀取媒體失敗" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await validateSession();
  if (!auth) return NextResponse.json({ error: "未登入" }, { status: 401 });
  if (!checkOrigin(request)) return NextResponse.json({ error: "來源不允許" }, { status: 403 });

  try {
    const { id } = await request.json();
    await prisma.media.delete({ where: { id: Number(id) } });
    return NextResponse.json({ data: { message: "已刪除" } });
  } catch {
    return NextResponse.json({ error: "刪除媒體失敗" }, { status: 500 });
  }
}
