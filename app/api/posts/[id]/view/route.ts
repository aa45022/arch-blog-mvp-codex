import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * POST /api/posts/[id]/view — 增加閱讀數（公開 API，不需登入）
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: { viewCount: { increment: 1 } },
      select: { viewCount: true },
    });
    return NextResponse.json({ viewCount: post.viewCount });
  } catch {
    return NextResponse.json({ error: "更新失敗" }, { status: 500 });
  }
}
