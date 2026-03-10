import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSession } from "@/lib/auth";

/**
 * GET /api/categories — 分類列表
 */
export async function GET() {
  const auth = await validateSession();
  if (!auth) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ data: categories });
  } catch {
    return NextResponse.json({ error: "讀取分類失敗" }, { status: 500 });
  }
}
