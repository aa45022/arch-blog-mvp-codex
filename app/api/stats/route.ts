import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/stats — 公開的網站統計數據
 */
export async function GET() {
  try {
    const [
      totalPosts,
      totalViews,
      totalCategories,
      totalTags,
      topPosts,
      categoryStats,
      recentPosts,
      monthlyPosts,
    ] = await Promise.all([
      prisma.post.count({ where: { published: true } }),
      prisma.post.aggregate({ where: { published: true }, _sum: { viewCount: true } }),
      prisma.category.count(),
      prisma.tag.count(),
      // Top 10 最多閱讀
      prisma.post.findMany({
        where: { published: true },
        orderBy: { viewCount: "desc" },
        take: 10,
        select: { title: true, slug: true, viewCount: true, category: { select: { name: true } } },
      }),
      // 各分類文章數
      prisma.category.findMany({
        include: { _count: { select: { posts: { where: { published: true } } } } },
        orderBy: { name: "asc" },
      }),
      // 最近 5 篇
      prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { title: true, slug: true, createdAt: true, viewCount: true },
      }),
      // 月份分佈（最近 12 個月）
      prisma.post.findMany({
        where: { published: true },
        select: { createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    // 處理月份分佈
    const monthMap: Record<string, number> = {};
    monthlyPosts.forEach((p) => {
      const key = `${p.createdAt.getFullYear()}-${String(p.createdAt.getMonth() + 1).padStart(2, "0")}`;
      monthMap[key] = (monthMap[key] || 0) + 1;
    });
    const monthlyData = Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([month, count]) => ({ month, count }));

    return NextResponse.json({
      data: {
        totalPosts,
        totalViews: totalViews._sum.viewCount || 0,
        totalCategories,
        totalTags,
        topPosts,
        categoryStats: categoryStats.map((c) => ({
          name: c.name,
          count: c._count.posts,
        })),
        recentPosts,
        monthlyData,
      },
    });
  } catch {
    return NextResponse.json({ error: "讀取統計失敗" }, { status: 500 });
  }
}
