import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { validateSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * POST /api/posts/:id/duplicate — 複製文章
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await validateSession();
  if (!auth) return NextResponse.json({ error: "未登入" }, { status: 401 });

  try {
    const { id } = await params;
    const original = await prisma.post.findUnique({
      where: { id: Number(id) },
      include: { tags: { select: { id: true } } },
    });

    if (!original) return NextResponse.json({ error: "文章不存在" }, { status: 404 });

    const newSlug = `${original.slug}-copy-${Date.now()}`;
    const copy = await prisma.post.create({
      data: {
        title: `${original.title}（副本）`,
        slug: newSlug,
        excerpt: original.excerpt,
        content: original.content,
        coverImage: original.coverImage,
        published: false,
        featured: false,
        excerptRender: original.excerptRender,
        categoryId: original.categoryId,
        seriesId: original.seriesId,
        tags: original.tags.length > 0
          ? { connect: original.tags.map((t) => ({ id: t.id })) }
          : undefined,
      },
    });

    revalidatePath("/admin/posts");
    return NextResponse.json({ data: copy }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "複製文章失敗" }, { status: 500 });
  }
}
