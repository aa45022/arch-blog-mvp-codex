import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PostCard from "@/components/post-card";
import SearchBar from "@/components/search-bar";
import TagFilter from "@/components/tag-filter";

/**
 * 首頁 — 顯示所有已發佈文章
 *
 * 支援 URL search params：
 *   ?q=關鍵字     搜尋 title + excerpt
 *   ?category=slug 分類篩選
 *   ?tag=slug      標籤篩選
 */
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; tag?: string }>;
}) {
  const params = await searchParams;
  const { q, category, tag } = params;

  // ─── 查詢已發佈文章 ───
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      // 搜尋：title 或 excerpt 包含關鍵字
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" as const } },
              { excerpt: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
      // 分類篩選
      ...(category ? { category: { slug: category } } : {}),
      // 標籤篩選
      ...(tag ? { tags: { some: { slug: tag } } } : {}),
    },
    include: {
      category: { select: { name: true, slug: true } },
      tags: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // ─── 查詢所有分類與標籤（用於篩選列） ───
  const categories = await prisma.category.findMany({
    select: { name: true, slug: true },
    orderBy: { name: "asc" },
  });

  const tags = await prisma.tag.findMany({
    select: { name: true, slug: true },
    orderBy: { name: "asc" },
  });

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* 搜尋列 */}
          <div className="mb-6">
            <Suspense fallback={null}>
              <SearchBar />
            </Suspense>
          </div>

          {/* 分類 + 標籤篩選 */}
          <div className="mb-8">
            <Suspense fallback={null}>
              <TagFilter categories={categories} tags={tags} />
            </Suspense>
          </div>

          {/* 搜尋結果提示 */}
          {q && (
            <p className="text-sm text-gray-500 mb-4">
              搜尋「{q}」— 找到 {posts.length} 篇文章
            </p>
          )}

          {/* 文章列表 */}
          {posts.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg mb-2">找不到符合條件的文章</p>
              <p className="text-sm">試試其他關鍵字或清除篩選</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  title={post.title}
                  slug={post.slug}
                  excerpt={post.excerpt}
                  categoryName={post.category.name}
                  categorySlug={post.category.slug}
                  tags={post.tags}
                  createdAt={post.createdAt.toISOString()}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
