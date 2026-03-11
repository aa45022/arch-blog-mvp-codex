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
    const { title, slug: rawSlug, excerpt, content, categoryId, tagIds, coverImage, published, featured } = body;

    if (!title || !rawSlug || !excerpt || !content || !categoryId) {
      return NextResponse.json({ error: "必填欄位不完整" }, { status: 400 });
    }

    // 清理 slug
    const slug = rawSlug
      .toLowerCase()
      .trim()
      .replace(/[^\w\u4e00-\u9fff]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!slug) {
      return NextResponse.json({ error: "網址代稱無效" }, { status: 400 });
    }

    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing && existing.id !== Number(id)) {
      return NextResponse.json({ error: "此網址代稱已被使用" }, { status: 400 });
    }

    // 自動保存版本歷史（更新前快照）
    const currentPost = await prisma.post.findUnique({
      where: { id: Number(id) },
      select: { title: true, content: true, excerpt: true },
    });
    if (currentPost) {
      await prisma.postVersion.create({
        data: {
          postId: Number(id),
          title: currentPost.title,
          content: currentPost.content,
          excerpt: currentPost.excerpt,
        },
      });
    }

    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        title, slug, excerpt, content,
        coverImage: coverImage || null,
        published: published ?? false,
        featured: featured ?? false,
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
    revalidatePath("/news");
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
    revalidatePath("/news");
    revalidatePath("/admin/posts");
    if (post) revalidatePath(`/posts/${post.slug}`);

    return NextResponse.json({ data: { message: "已刪除" } });
  } catch {
    return NextResponse.json({ error: "刪除文章失敗" }, { status: 500 });
  }
}
