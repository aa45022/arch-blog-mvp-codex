import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSession, checkOrigin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { posts: true } } },
    });
    return NextResponse.json({ data: categories });
  } catch {
    return NextResponse.json({ error: "讀取分類失敗" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await validateSession();
  if (!auth) return NextResponse.json({ error: "未登入" }, { status: 401 });
  if (!checkOrigin(request)) return NextResponse.json({ error: "來源不允許" }, { status: 403 });

  try {
    const body = await request.json();
    const { name } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "分類名稱不能為空" }, { status: 400 });
    }

    // 自動產生 slug
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || `category-${Date.now()}`;

    const existing = await prisma.category.findFirst({
      where: { OR: [{ name }, { slug }] },
    });
    if (existing) {
      return NextResponse.json({ error: "此分類名稱已存在" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: { name: name.trim(), slug },
    });

    return NextResponse.json({ data: category }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "新增分類失敗" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await validateSession();
  if (!auth) return NextResponse.json({ error: "未登入" }, { status: 401 });
  if (!checkOrigin(request)) return NextResponse.json({ error: "來源不允許" }, { status: 403 });

  try {
    const { id } = await request.json();
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
      include: { _count: { select: { posts: true } } },
    });

    if (!category) return NextResponse.json({ error: "分類不存在" }, { status: 404 });
    if (category._count.posts > 0) {
      return NextResponse.json({ error: `此分類下有 ${category._count.posts} 篇文章，無法刪除` }, { status: 400 });
    }

    await prisma.category.delete({ where: { id: Number(id) } });
    return NextResponse.json({ data: { message: "已刪除" } });
  } catch {
    return NextResponse.json({ error: "刪除分類失敗" }, { status: 500 });
  }
}
