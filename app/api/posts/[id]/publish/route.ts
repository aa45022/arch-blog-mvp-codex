import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSession, checkOrigin } from "@/lib/auth";

/**
 * PATCH /api/posts/[id]/publish — 切換發佈狀態
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await validateSession();
  if (!auth) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  if (!checkOrigin(request)) {
    return NextResponse.json({ error: "來源不允許" }, { status: 403 });
  }

  try {
    const { id } = await params;

    // 取得目前狀態
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
      select: { published: true },
    });

    if (!post) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 });
    }

    // 切換
    const updated = await prisma.post.update({
      where: { id: Number(id) },
      data: { published: !post.published },
      select: { id: true, published: true },
    });

    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json({ error: "切換發佈狀態失敗" }, { status: 500 });
  }
}
