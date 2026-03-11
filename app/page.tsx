import { Suspense } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PostCard from "@/components/post-card";
import SearchBar from "@/components/search-bar";
import TagFilter from "@/components/tag-filter";
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
    coverImage: string | null; createdAt: Date;
    category: { name: string; slug: string };
    tags: { name: string; slug: string }[];
  }> = [];
  let categories: { name: string; slug: string }[] = [];
  let tags: { name: string; slug: string }[] = [];
  let totalCount = 0;
  let dbError = false;

  try {
    const { prisma } = await import("@/lib/prisma");

    const where = {
      published: true,
      ...(q ? { OR: [
        { title: { contains: q, mode: "insensitive" as const } },
        { excerpt: { contains: q, mode: "insensitive" as const } },
      ]} : {}),
      ...(category ? { category: { slug: category } } : {}),
      ...(tag ? { tags: { some: { slug: tag } } } : {}),
    };

    [totalCount, posts, categories, tags] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        include: {
          category: { select: { name: true, slug: true } },
          tags: { select: { name: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PER_PAGE,
        take: PER_PAGE,
      }),
      prisma.category.findMany({ select: { name: true, slug: true }, orderBy: { name: "asc" } }),
      prisma.tag.findMany({ select: { name: true, slug: true }, orderBy: { name: "asc" } }),
    ]);
  } catch {
    dbError = true;
  }

  const totalPages = Math.ceil(totalCount / PER_PAGE);

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-white dark:bg-neutral-950 px-4 py-12">
          <div className="max-w-5xl mx-auto">
            {/* Hero 標題區 */}
            <div className="mb-12 pb-8 border-b border-neutral-200 dark:border-neutral-800">
              <p className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.25em] mb-3">
                Architecture Notes
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight leading-tight">
                學習筆記
              </h2>
            </div>

            {/* 搜尋 + 篩選 */}
            <div className="mb-6 max-w-xl">
              <Suspense fallback={null}><SearchBar /></Suspense>
            </div>
            <div className="mb-10">
              <Suspense fallback={null}>
                <TagFilter categories={categories} tags={tags} />
              </Suspense>
            </div>

            {dbError ? (
              <div className="text-center py-20 text-neutral-400 dark:text-neutral-600">
                <p className="text-base mb-2">暫時無法載入文章</p>
                <p className="text-xs">請稍後再試</p>
              </div>
            ) : (
              <>
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
                    {/* 大卡片 grid：1 欄 → 2 欄 */}
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
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
