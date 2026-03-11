"use client";

import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useBookmarks } from "@/components/bookmark-button";
import { Bookmark, Trash2 } from "lucide-react";

export default function ReadingListPage() {
  const { bookmarks, removeBookmark } = useBookmarks();

  return (
    <>
      <Header />
      <main className="flex-1 page-enter">
        <section className="bg-white dark:bg-neutral-950 px-4 py-12">
          <div className="max-w-3xl mx-auto">
            {/* 標題 */}
            <div className="mb-12 pb-8 border-b border-neutral-200 dark:border-neutral-800">
              <p className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.25em] mb-3 font-display">
                Reading List
              </p>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 tracking-wide font-serif">
                閱讀清單
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-3">
                你收藏的文章 · 儲存在瀏覽器中
              </p>
            </div>

            {bookmarks.length === 0 ? (
              <div className="text-center py-20">
                <Bookmark className="w-8 h-8 text-neutral-200 dark:text-neutral-800 mx-auto mb-4" />
                <p className="text-base text-neutral-400 dark:text-neutral-600 mb-2 font-serif">
                  還沒有收藏文章
                </p>
                <p className="text-xs text-neutral-300 dark:text-neutral-700 mb-6">
                  瀏覽文章時點擊書籤圖示即可收藏
                </p>
                <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
                  ← 回首頁探索文章
                </Link>
              </div>
            ) : (
              <>
                <p className="text-xs text-neutral-400 dark:text-neutral-600 mb-6">
                  共 {bookmarks.length} 篇收藏
                </p>
                <div className="space-y-0 divide-y divide-neutral-200 dark:divide-neutral-800">
                  {bookmarks
                    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
                    .map((post) => (
                    <div key={post.id} className="flex items-center justify-between py-4 group">
                      <Link href={`/posts/${post.slug}`} className="flex-1 min-w-0">
                        <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate group-hover:opacity-60 transition-opacity font-serif tracking-wide">
                          {post.title}
                        </h2>
                        <p className="text-[10px] text-neutral-400 dark:text-neutral-600 mt-1">
                          收藏於 {new Date(post.addedAt).toLocaleDateString("zh-TW")}
                        </p>
                      </Link>
                      <button
                        onClick={() => removeBookmark(post.id)}
                        title="移除收藏"
                        className="ml-4 text-neutral-300 dark:text-neutral-700 hover:text-red-500 dark:hover:text-red-400 transition-colors shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
