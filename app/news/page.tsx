import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Pagination from "@/components/pagination";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "時事專欄 | SITE LAB",
  description: "建築與都市設計時事觀察與評論。",
};

export const dynamic = "force-dynamic";

const PER_PAGE = 10;

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  let posts: Array<{
    id: number; title: string; slug: string; excerpt: string;
    coverImage: string | null; createdAt: Date; viewCount: number;
    category: { name: string; slug: string };
  }> = [];
  let totalCount = 0;
  let dbError = false;

  try {
    const { prisma } = await import("@/lib/prisma");

    const where = {
      published: true,
      category: { slug: "news" },
    };

    [totalCount, posts] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        include: {
          category: { select: { name: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PER_PAGE,
        take: PER_PAGE,
      }),
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
          <div className="max-w-4xl mx-auto">
            {/* 標題區 */}
            <div className="mb-12 pb-8 border-b border-neutral-200 dark:border-neutral-800">
              <p className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.25em] mb-3">
                Current Affairs
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                時事專欄
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-3">
                建築與都市設計時事觀察
              </p>
            </div>

            {dbError ? (
              <div className="text-center py-20 text-neutral-400 dark:text-neutral-600">
                <p className="text-base mb-2">暫時無法載入文章</p>
                <p className="text-xs">請稍後再試</p>
              </div>
            ) : totalCount === 0 ? (
              <div className="text-center py-20 text-neutral-400 dark:text-neutral-600">
                <p className="text-base mb-4">時事專欄尚無文章</p>
                <p className="text-xs mb-6">
                  請在後台新增文章，並將分類設為「時事」（slug: news）
                </p>
                <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
                  ← 返回首頁
                </Link>
              </div>
            ) : (
              <>
                {/* 時事文章列表 — 報紙風格：橫式排列 */}
                <div className="space-y-0 divide-y divide-neutral-200 dark:divide-neutral-800">
                  {posts.map((post) => {
                    const date = new Date(post.createdAt).toLocaleDateString("zh-TW", {
                      year: "numeric", month: "short", day: "numeric",
                    });
                    return (
                      <article key={post.id} className="py-8 first:pt-0">
                        <Link href={`/posts/${post.slug}`} className="group flex gap-6 items-start">
                          {/* 文字 */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <time className="text-[10px] text-neutral-400 dark:text-neutral-600">{date}</time>
                              {post.viewCount > 0 && (
                                <>
                                  <span className="w-3 border-t border-neutral-300 dark:border-neutral-700" />
                                  <span className="text-[10px] text-neutral-400 dark:text-neutral-600">
                                    {post.viewCount.toLocaleString()} 次閱讀
                                  </span>
                                </>
                              )}
                            </div>
                            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 leading-snug tracking-tight mb-2 group-hover:opacity-60 transition-opacity">
                              {post.title}
                            </h2>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2">
                              {post.excerpt}
                            </p>
                          </div>
                          {/* 縮圖 */}
                          {post.coverImage && (
                            <div className="hidden sm:block w-40 h-28 flex-shrink-0 overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                              <Image
                                src={post.coverImage}
                                alt={post.title}
                                width={320}
                                height={224}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                          )}
                        </Link>
                      </article>
                    );
                  })}
                </div>

                <Suspense fallback={null}>
                  <Pagination currentPage={page} totalPages={totalPages} />
                </Suspense>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
