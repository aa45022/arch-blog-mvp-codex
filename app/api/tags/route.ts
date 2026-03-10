import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSession } from "@/lib/auth";

/**
 * GET /api/tags — 標籤列表
 */
export async function GET() {
  const auth = await validateSession();
  if (!auth) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ data: tags });
  } catch {
    return NextResponse.json({ error: "讀取標籤失敗" }, { status: 500 });
  }
}
