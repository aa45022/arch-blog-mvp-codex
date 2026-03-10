import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { validateSession, checkOrigin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await validateSession();
  if (!auth) return NextResponse.json({ error: "未登入" }, { status: 401 });

  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } },
      },
    });
    if (!post) return NextResponse.json({ error: "文章不存在" }, { status: 404 });
    return NextResponse.json({ data: post });
  } catch {
    return NextResponse.json({ error: "讀取文章失敗" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await validateSession();
  if (!auth) return NextResponse.json({ error: "未登入" }, { status: 401 });
  if (!checkOrigin(request)) return NextResponse.json({ error: "來源不允許" }, { status: 403 });

  try {
    const { id } = await params;
    const body = await request.json();
    const { title, slug, excerpt, content, categoryId, tagIds, coverImage, published } = body;

    if (!title || !slug || !excerpt || !content || !categoryId) {
      return NextResponse.json({ error: "必填欄位不完整" }, { status: 400 });
    }

    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing && existing.id !== Number(id)) {
      return NextResponse.json({ error: "此網址代稱已被使用" }, { status: 400 });
    }

    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        title, slug, excerpt, content,
        coverImage: coverImage || null,
        published: published ?? false,
        categoryId: Number(categoryId),
        tags: {
          set: [],
          ...(tagIds?.length
            ? { connect: tagIds.map((tid: number) => ({ id: Number(tid) })) }
            : {}),
        },
      },
      include: {
        category: { select: { name: true } },
        tags: { select: { name: true } },
      },
    });

    revalidatePath("/");
    revalidatePath(`/posts/${slug}`);
    revalidatePath("/admin/posts");

    return NextResponse.json({ data: post });
  } catch {
    return NextResponse.json({ error: "更新文章失敗" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await validateSession();
  if (!auth) return NextResponse.json({ error: "未登入" }, { status: 401 });
  if (!checkOrigin(request)) return NextResponse.json({ error: "來源不允許" }, { status: 403 });

  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({ where: { id: Number(id) }, select: { slug: true } });
    await prisma.post.delete({ where: { id: Number(id) } });

    revalidatePath("/");
    revalidatePath("/admin/posts");
    if (post) revalidatePath(`/posts/${post.slug}`);

    return NextResponse.json({ data: { message: "已刪除" } });
  } catch {
    return NextResponse.json({ error: "刪除文章失敗" }, { status: 500 });
  }
}
