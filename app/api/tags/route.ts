import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSession, checkOrigin } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/tags — 標籤列表
 */
export async function GET() {
  const auth = await validateSession();
  if (!auth) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ data: tags });
  } catch {
    return NextResponse.json({ error: "讀取標籤失敗" }, { status: 500 });
  }
}

/**
 * POST /api/tags — 新增標籤
 */
export async function POST(request: Request) {
  const auth = await validateSession();
  if (!auth) return NextResponse.json({ error: "未登入" }, { status: 401 });
  if (!checkOrigin(request)) return NextResponse.json({ error: "來源不允許" }, { status: 403 });

  try {
    const body = await request.json();
    const { name } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "標籤名稱不能為空" }, { status: 400 });
    }

    // 自動產生 slug（中文保留，特殊字元轉 -）
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\u4e00-\u9fff]+/g, "-")
      .replace(/^-+|-+$/g, "") || `tag-${Date.now()}`;

    const existing = await prisma.tag.findFirst({
      where: { OR: [{ name: name.trim() }, { slug }] },
    });
    if (existing) {
      return NextResponse.json({ error: "此標籤已存在" }, { status: 400 });
    }

    const tag = await prisma.tag.create({
      data: { name: name.trim(), slug },
    });

    return NextResponse.json({ data: tag }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "新增標籤失敗" }, { status: 500 });
  }
}
