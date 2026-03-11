"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { BarChart3, Eye, FileText, Tag, FolderOpen, TrendingUp } from "lucide-react";

type Stats = {
  totalPosts: number;
  totalViews: number;
  totalCategories: number;
  totalTags: number;
  topPosts: { title: string; slug: string; viewCount: number; category: { name: string } }[];
  categoryStats: { name: string; count: number }[];
  recentPosts: { title: string; slug: string; createdAt: string; viewCount: number }[];
  monthlyData: { month: string; count: number }[];
};

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) {
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 p-6">
      <Icon className="w-4 h-4 text-neutral-400 dark:text-neutral-600 mb-3" />
      <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight font-display">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      <p className="text-[10px] text-neutral-400 dark:text-neutral-600 mt-1 uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data.data) setStats(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const maxMonthly = stats ? Math.max(...stats.monthlyData.map((m) => m.count), 1) : 1;
  const maxCategory = stats ? Math.max(...stats.categoryStats.map((c) => c.count), 1) : 1;
  const maxViews = stats ? Math.max(...stats.topPosts.map((p) => p.viewCount), 1) : 1;

  return (
    <>
      <Header />
      <main className="flex-1 page-enter">
        <section className="bg-white dark:bg-neutral-950 px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* 標題 */}
            <div className="mb-12 pb-8 border-b border-neutral-200 dark:border-neutral-800">
              <p className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.25em] mb-3 font-display">
                Dashboard
              </p>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 tracking-wide font-serif">
                網站數據
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-3">
                SITE LAB 敷地實驗室的公開統計數據
              </p>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <p className="text-sm text-neutral-400 animate-pulse">載入中...</p>
              </div>
            ) : !stats ? (
              <div className="text-center py-20">
                <p className="text-sm text-neutral-400">暫時無法載入數據</p>
              </div>
            ) : (
              <div className="space-y-16">
                {/* 總覽 */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <StatCard icon={FileText} label="文章數" value={stats.totalPosts} />
                  <StatCard icon={Eye} label="總閱讀數" value={stats.totalViews} />
                  <StatCard icon={FolderOpen} label="分類數" value={stats.totalCategories} />
                  <StatCard icon={Tag} label="標籤數" value={stats.totalTags} />
                </div>

                {/* 發文趨勢 */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-4 h-4 text-neutral-400" />
                    <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 font-serif tracking-wide">
                      發文趨勢
                    </h2>
                  </div>
                  <div className="flex items-end gap-2 h-40">
                    {stats.monthlyData.map((m) => (
                      <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[10px] text-neutral-400">{m.count}</span>
                        <div
                          className="w-full bg-neutral-900 dark:bg-neutral-100 transition-all duration-500"
                          style={{ height: `${(m.count / maxMonthly) * 100}%`, minHeight: m.count > 0 ? 4 : 0 }}
                        />
                        <span className="text-[9px] text-neutral-400 dark:text-neutral-600 whitespace-nowrap">
                          {m.month.slice(5)}月
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                  {/* 各分類文章數 */}
                  <div>
                    <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-6 font-serif tracking-wide">
                      分類分佈
                    </h2>
                    <div className="space-y-3">
                      {stats.categoryStats
                        .filter((c) => c.count > 0)
                        .sort((a, b) => b.count - a.count)
                        .map((cat) => (
                        <div key={cat.name}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-neutral-600 dark:text-neutral-400">{cat.name}</span>
                            <span className="text-xs text-neutral-400 dark:text-neutral-600">{cat.count}</span>
                          </div>
                          <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800">
                            <div
                              className="h-full bg-neutral-900 dark:bg-neutral-100 transition-all duration-500"
                              style={{ width: `${(cat.count / maxCategory) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 熱門文章 Top 10 */}
                  <div>
                    <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-6 font-serif tracking-wide">
                      熱門文章 Top 10
                    </h2>
                    <div className="space-y-0 divide-y divide-neutral-100 dark:divide-neutral-800">
                      {stats.topPosts.map((post, i) => (
                        <Link
                          key={post.slug}
                          href={`/posts/${post.slug}`}
                          className="flex items-start gap-3 py-3 group"
                        >
                          <span className="text-[10px] text-neutral-300 dark:text-neutral-700 font-mono w-4 shrink-0 pt-0.5">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-neutral-900 dark:text-neutral-100 truncate group-hover:opacity-60 transition-opacity font-serif">
                              {post.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-neutral-400 dark:text-neutral-600">
                                {post.category.name}
                              </span>
                              <span className="text-[10px] text-neutral-300 dark:text-neutral-700">·</span>
                              <span className="text-[10px] text-neutral-400 dark:text-neutral-600">
                                {post.viewCount.toLocaleString()} 次閱讀
                              </span>
                            </div>
                          </div>
                          {/* mini bar */}
                          <div className="w-16 h-1.5 bg-neutral-100 dark:bg-neutral-800 self-center shrink-0">
                            <div
                              className="h-full bg-neutral-900 dark:bg-neutral-100"
                              style={{ width: `${(post.viewCount / maxViews) * 100}%` }}
                            />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 最近發佈 */}
                <div>
                  <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-6 font-serif tracking-wide">
                    最近發佈
                  </h2>
                  <div className="grid sm:grid-cols-5 gap-4">
                    {stats.recentPosts.map((post) => (
                      <Link
                        key={post.slug}
                        href={`/posts/${post.slug}`}
                        className="border border-neutral-200 dark:border-neutral-800 p-4 hover:border-neutral-900 dark:hover:border-neutral-400 transition-colors group"
                      >
                        <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 group-hover:opacity-60 transition-opacity line-clamp-2 font-serif tracking-wide mb-2">
                          {post.title}
                        </p>
                        <p className="text-[10px] text-neutral-400 dark:text-neutral-600">
                          {new Date(post.createdAt).toLocaleDateString("zh-TW")}
                        </p>
                      </Link>
                    ))}
                  </div>
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
