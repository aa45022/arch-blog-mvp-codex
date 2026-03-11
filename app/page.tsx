import { Suspense } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PostCard from "@/components/post-card";
import SearchBar from "@/components/search-bar";
import SidebarFilter from "@/components/sidebar-filter";
import HeroSection from "@/components/hero-section";
import Pagination from "@/components/pagination";

export const dynamic = "force-dynamic";

const PER_PAGE = 8;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; tag?: string; page?: string }>;
}) {
  const params = await searchParams;
  const { q, category, tag } = params;
  const page = Math.max(1, Number(params.page) || 1);

  let posts: Array<{
    id: number; title: string; slug: string; excerpt: string;
    coverImage: string | null; createdAt: Date; viewCount: number;
    category: { name: string; slug: string };
    tags: { name: string; slug: string }[];
  }> = [];
  let categories: { name: string; slug: string }[] = [];
  let tags: { name: string; slug: string }[] = [];
  let totalCount = 0;
  let totalViews = 0;
  let dbError = false;

  // Hero 用：精選或最新文章
  let heroPost: {
    title: string; slug: string; excerpt: string;
    coverImage: string | null; createdAt: Date;
    category: { name: string; slug: string };
  } | null = null;

  try {
    const { prisma } = await import("@/lib/prisma");

    // 排除「時事」分類 slug = "news" 的文章（時事專欄獨立頁面）
    const excludeNewsFilter = { category: { slug: { not: "news" } } };

    const where = {
      published: true,
      ...excludeNewsFilter,
      ...(q ? { OR: [
        { title: { contains: q, mode: "insensitive" as const } },
        { excerpt: { contains: q, mode: "insensitive" as const } },
      ]} : {}),
      ...(category ? { category: { slug: category } } : {}),
      ...(tag ? { tags: { some: { slug: tag } } } : {}),
    };

    // 取得 Hero 文章（精選優先，否則最新）
    if (page === 1 && !q && !category && !tag) {
      heroPost = await prisma.post.findFirst({
        where: { published: true, featured: true, ...excludeNewsFilter },
        orderBy: { createdAt: "desc" },
        include: { category: { select: { name: true, slug: true } } },
      });
      if (!heroPost) {
        heroPost = await prisma.post.findFirst({
          where: { published: true, ...excludeNewsFilter },
          orderBy: { createdAt: "desc" },
          include: { category: { select: { name: true, slug: true } } },
        });
      }
    }

    const heroSlug = heroPost?.slug;

    // 主查詢排除 Hero 文章
    const mainWhere = heroSlug
      ? { ...where, slug: { not: heroSlug } }
      : where;

    [totalCount, posts, categories, tags] = await Promise.all([
      prisma.post.count({ where: mainWhere }),
      prisma.post.findMany({
        where: mainWhere,
        include: {
          category: { select: { name: true, slug: true } },
          tags: { select: { name: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PER_PAGE,
        take: PER_PAGE,
      }),
      prisma.category.findMany({
        where: { slug: { not: "news" } },
        select: { name: true, slug: true },
        orderBy: { name: "asc" },
      }),
      prisma.tag.findMany({ select: { name: true, slug: true }, orderBy: { name: "asc" } }),
    ]);

    // 全站閱讀數
    const viewAgg = await prisma.post.aggregate({ _sum: { viewCount: true } });
    totalViews = viewAgg._sum.viewCount || 0;
  } catch {
    dbError = true;
  }

  const totalPages = Math.ceil(totalCount / PER_PAGE);

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-white dark:bg-neutral-950 px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Hero */}
            {heroPost && page === 1 && !q && !category && !tag && (
              <HeroSection
                post={{
                  title: heroPost.title,
                  slug: heroPost.slug,
                  excerpt: heroPost.excerpt,
                  coverImage: heroPost.coverImage,
                  categoryName: heroPost.category.name,
                  categorySlug: heroPost.category.slug,
                  createdAt: heroPost.createdAt.toISOString(),
                }}
              />
            )}

            {/* 搜尋列 */}
            <div className="mb-8 max-w-xl">
              <Suspense fallback={null}><SearchBar /></Suspense>
            </div>

            {dbError ? (
              <div className="text-center py-20 text-neutral-400 dark:text-neutral-600">
                <p className="text-base mb-2">暫時無法載入文章</p>
                <p className="text-xs">請稍後再試</p>
              </div>
            ) : (
              /* 側邊欄 + Grid 佈局 */
              <div className="lg:grid lg:grid-cols-[200px_1fr] lg:gap-12">
                {/* 左側欄 */}
                <div>
                  <Suspense fallback={null}>
                    <SidebarFilter
                      categories={categories}
                      tags={tags}
                      totalCount={totalCount + (heroPost ? 1 : 0)}
                      totalViews={totalViews}
                    />
                  </Suspense>
                </div>

                {/* 右側內容 */}
                <div>
                  {/* 統計 */}
                  <div className="flex items-center justify-between mb-6">
                    {q && <p className="text-xs text-neutral-500 dark:text-neutral-400">搜尋「{q}」— 共 {totalCount} 篇</p>}
                    {!q && <p className="text-xs text-neutral-400 dark:text-neutral-600">共 {totalCount} 篇文章</p>}
                    {totalPages > 1 && (
                      <p className="text-[10px] text-neutral-400 dark:text-neutral-600">{page} / {totalPages}</p>
                    )}
                  </div>

                  {posts.length === 0 ? (
                    <div className="text-center py-20 text-neutral-400 dark:text-neutral-600">
                      <p className="text-base mb-2">找不到符合條件的文章</p>
                      <p className="text-xs">試試其他關鍵字或清除篩選</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
                        {posts.map((post) => (
                          <PostCard
                            key={post.id}
                            title={post.title}
                            slug={post.slug}
                            excerpt={post.excerpt}
                            coverImage={post.coverImage}
                            categoryName={post.category.name}
                            categorySlug={post.category.slug}
                            tags={post.tags}
                            createdAt={post.createdAt.toISOString()}
                          />
                        ))}
                      </div>
                      <Suspense fallback={null}>
                        <Pagination currentPage={page} totalPages={totalPages} />
                      </Suspense>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
