import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/posts/:id/versions — 取得文章版本歷史
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await validateSession();
  if (!auth) return NextResponse.json({ error: "未登入" }, { status: 401 });

  try {
    const { id } = await params;
    const versions = await prisma.postVersion.findMany({
      where: { postId: Number(id) },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        excerpt: true,
        note: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ data: versions });
  } catch {
    return NextResponse.json({ error: "讀取版本歷史失敗" }, { status: 500 });
  }
}
