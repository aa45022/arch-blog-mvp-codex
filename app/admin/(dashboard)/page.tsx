"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Eye, FolderOpen, Tag, Plus, TrendingUp, Clock } from "lucide-react";

type DashboardData = {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalCategories: number;
  totalTags: number;
  recentPosts: { id: number; title: string; slug: string; published: boolean; updatedAt: string; viewCount: number }[];
  topPosts: { title: string; slug: string; viewCount: number }[];
};

function StatCard({ icon: Icon, label, value, href }: { icon: React.ElementType; label: string; value: number; href?: string }) {
  const inner = (
    <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors">
      <Icon className="w-4 h-4 text-neutral-400 dark:text-neutral-600 mb-3" />
      <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight font-display">{value.toLocaleString()}</p>
      <p className="text-[10px] text-neutral-400 dark:text-neutral-600 mt-1 uppercase tracking-wider">{label}</p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [postsRes, statsRes] = await Promise.all([
          fetch("/api/posts"),
          fetch("/api/stats"),
        ]);
        const postsData = await postsRes.json();
        const statsData = await statsRes.json();

        const posts = postsData.data || [];
        const stats = statsData.data || {};

        setData({
          totalPosts: posts.length,
          publishedPosts: posts.filter((p: { published: boolean }) => p.published).length,
          draftPosts: posts.filter((p: { published: boolean }) => !p.published).length,
          totalViews: stats.totalViews || 0,
          totalCategories: stats.totalCategories || 0,
          totalTags: stats.totalTags || 0,
          recentPosts: posts.slice(0, 5).map((p: { id: number; title: string; slug: string; published: boolean; updatedAt: string; viewCount: number }) => ({
            id: p.id, title: p.title, slug: p.slug, published: p.published, updatedAt: p.updatedAt, viewCount: p.viewCount,
          })),
          topPosts: stats.topPosts?.slice(0, 5) || [],
        });
      } catch { /* ignore */ }
    }
    load();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 font-serif tracking-wide">總覽</h1>
          <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-1">歡迎回到 SITE LAB 後台</p>
        </div>
        <Link href="/admin/posts/new"
          className="flex items-center gap-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-medium px-4 py-2.5 hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors">
          <Plus className="w-3.5 h-3.5" />
          新增文章
        </Link>
      </div>

      {!data ? (
        <div className="text-center py-20"><p className="text-sm text-neutral-400 animate-pulse">載入中...</p></div>
      ) : (
        <div className="space-y-10">
          {/* 數據卡片 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatCard icon={FileText} label="全部文章" value={data.totalPosts} href="/admin/posts" />
            <StatCard icon={TrendingUp} label="已發佈" value={data.publishedPosts} />
            <StatCard icon={Clock} label="草稿" value={data.draftPosts} />
            <StatCard icon={Eye} label="總閱讀" value={data.totalViews} />
            <StatCard icon={FolderOpen} label="分類" value={data.totalCategories} href="/admin/categories" />
            <StatCard icon={Tag} label="標籤" value={data.totalTags} />
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* 最近編輯 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 font-serif">最近文章</h2>
                <Link href="/admin/posts" className="text-[10px] text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
                  查看全部 →
                </Link>
              </div>
              <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 divide-y divide-neutral-100 dark:divide-neutral-800">
                {data.recentPosts.map((post) => (
                  <Link key={post.id} href={`/admin/posts/${post.id}/edit`}
                    className="flex items-center justify-between px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-neutral-900 dark:text-neutral-100 truncate group-hover:opacity-70 transition-opacity">{post.title}</p>
                      <p className="text-[10px] text-neutral-400 dark:text-neutral-600 mt-0.5">
                        {new Date(post.updatedAt).toLocaleDateString("zh-TW")}
                      </p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 ml-3 shrink-0 ${
                      post.published
                        ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
                    }`}>
                      {post.published ? "已發佈" : "草稿"}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* 熱門文章 */}
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-4 font-serif">熱門文章</h2>
              <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 divide-y divide-neutral-100 dark:divide-neutral-800">
                {data.topPosts.map((post, i) => (
                  <Link key={post.slug} href={`/posts/${post.slug}`} target="_blank"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group">
                    <span className="text-[10px] text-neutral-300 dark:text-neutral-700 font-mono w-4">{i + 1}</span>
                    <p className="text-xs text-neutral-900 dark:text-neutral-100 truncate flex-1 group-hover:opacity-70 transition-opacity">{post.title}</p>
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-600 shrink-0">{post.viewCount.toLocaleString()}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
