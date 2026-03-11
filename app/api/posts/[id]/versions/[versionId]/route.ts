import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/posts/:id/versions/:versionId — 取得特定版本詳情
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; versionId: string }> }
) {
  const auth = await validateSession();
  if (!auth) return NextResponse.json({ error: "未登入" }, { status: 401 });

  try {
    const { id, versionId } = await params;
    const version = await prisma.postVersion.findFirst({
      where: {
        id: Number(versionId),
        postId: Number(id),
      },
    });

    if (!version) {
      return NextResponse.json({ error: "版本不存在" }, { status: 404 });
    }

    return NextResponse.json({ data: version });
  } catch {
    return NextResponse.json({ error: "讀取版本失敗" }, { status: 500 });
  }
}
