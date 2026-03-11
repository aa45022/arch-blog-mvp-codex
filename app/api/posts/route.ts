import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { validateSession, checkOrigin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await validateSession();
  if (!auth) return NextResponse.json({ error: "未登入" }, { status: 401 });

  try {
    const posts = await prisma.post.findMany({
      include: {
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ data: posts });
  } catch {
    return NextResponse.json({ error: "讀取文章失敗" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await validateSession();
  if (!auth) return NextResponse.json({ error: "未登入" }, { status: 401 });
  if (!checkOrigin(request)) return NextResponse.json({ error: "來源不允許" }, { status: 403 });

  try {
    const body = await request.json();
    const { title, slug, excerpt, content, categoryId, tagIds, coverImage, published, featured } = body;

    if (!title || !slug || !excerpt || !content || !categoryId) {
      return NextResponse.json({ error: "必填欄位不完整" }, { status: 400 });
    }

    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) return NextResponse.json({ error: "此網址代稱已被使用" }, { status: 400 });

    const post = await prisma.post.create({
      data: {
        title, slug, excerpt, content,
        coverImage: coverImage || null,
        published: published ?? false,
        featured: featured ?? false,
        categoryId: Number(categoryId),
        tags: tagIds?.length
          ? { connect: tagIds.map((id: number) => ({ id: Number(id) })) }
          : undefined,
      },
      include: {
        category: { select: { name: true } },
        tags: { select: { name: true } },
      },
    });

    revalidatePath("/");
    revalidatePath("/news");
    revalidatePath("/admin/posts");

    return NextResponse.json({ data: post }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "新增文章失敗" }, { status: 500 });
  }
}
