import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSession, checkOrigin } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/series — 系列列表
 */
export async function GET() {
  const auth = await validateSession();
  if (!auth) return NextResponse.json({ error: "未登入" }, { status: 401 });

  try {
    const series = await prisma.series.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { posts: true } } },
    });
    return NextResponse.json({ data: series });
  } catch {
    return NextResponse.json({ error: "讀取系列失敗" }, { status: 500 });
  }
}

/**
 * POST /api/series — 新增系列
 */
export async function POST(request: Request) {
  const auth = await validateSession();
  if (!auth) return NextResponse.json({ error: "未登入" }, { status: 401 });
  if (!checkOrigin(request)) return NextResponse.json({ error: "來源不允許" }, { status: 403 });

  try {
    const body = await request.json();
    const { title, description } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "系列標題不能為空" }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\u4e00-\u9fff]+/g, "-")
      .replace(/^-+|-+$/g, "") || `series-${Date.now()}`;

    const existing = await prisma.series.findFirst({
      where: { OR: [{ title: title.trim() }, { slug }] },
    });
    if (existing) {
      return NextResponse.json({ error: "此系列已存在" }, { status: 400 });
    }

    const series = await prisma.series.create({
      data: { title: title.trim(), slug, description: description?.trim() || null },
    });

    return NextResponse.json({ data: series }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "新增系列失敗" }, { status: 500 });
  }
}
