import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { validateSession, checkOrigin } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * POST /api/posts/batch — 批次操作文章
 * body: { ids: number[], action: "publish" | "unpublish" | "delete" }
 */
export async function POST(request: Request) {
  const auth = await validateSession();
  if (!auth) return NextResponse.json({ error: "未登入" }, { status: 401 });
  if (!checkOrigin(request)) return NextResponse.json({ error: "來源不允許" }, { status: 403 });

  try {
    const { ids, action } = await request.json();

    if (!ids?.length || !action) {
      return NextResponse.json({ error: "參數不完整" }, { status: 400 });
    }

    const numIds = ids.map((id: number) => Number(id));

    switch (action) {
      case "publish":
        await prisma.post.updateMany({ where: { id: { in: numIds } }, data: { published: true } });
        break;
      case "unpublish":
        await prisma.post.updateMany({ where: { id: { in: numIds } }, data: { published: false } });
        break;
      case "delete":
        await prisma.post.deleteMany({ where: { id: { in: numIds } } });
        break;
      default:
        return NextResponse.json({ error: "無效的操作" }, { status: 400 });
    }

    revalidatePath("/");
    revalidatePath("/news");
    revalidatePath("/admin/posts");

    return NextResponse.json({ data: { message: `已對 ${numIds.length} 篇文章執行 ${action}` } });
  } catch {
    return NextResponse.json({ error: "批次操作失敗" }, { status: 500 });
  }
}
