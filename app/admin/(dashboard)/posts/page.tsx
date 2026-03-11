"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";

type Post = {
  id: number;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
  category: { name: string };
};

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filtered, setFiltered] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [loading, setLoading] = useState(true);

  async function loadPosts() {
    setLoading(true);
    const res = await fetch("/api/posts");
    const data = await res.json();
    if (data.data) setPosts(data.data);
    setLoading(false);
  }

  useEffect(() => { loadPosts(); }, []);

  // 篩選 + 排序
  useEffect(() => {
    let result = [...posts];

    // 搜尋
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          p.category.name.toLowerCase().includes(q)
      );
    }

    // 狀態篩選
    if (filterStatus === "published") result = result.filter((p) => p.published);
    if (filterStatus === "draft") result = result.filter((p) => !p.published);

    // 排序
    if (sortBy === "newest") result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (sortBy === "oldest") result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    if (sortBy === "title") result.sort((a, b) => a.title.localeCompare(b.title, "zh-TW"));

    setFiltered(result);
  }, [posts, search, sortBy, filterStatus]);

  async function handleTogglePublish(postId: number) {
    await fetch(`/api/posts/${postId}/publish`, { method: "PATCH" });
    await loadPosts();
  }

  async function handleDelete(postId: number, postTitle: string) {
    if (!confirm(`確定要刪除「${postTitle}」嗎？此操作無法復原。`)) return;
    await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    await loadPosts();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">文章管理</h1>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
            共 {posts.length} 篇文章
            {search && ` · 搜尋到 ${filtered.length} 篇`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/categories"
            className="border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 text-sm px-4 py-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            管理分類
          </Link>
          <Link
            href="/admin/posts/new"
            className="bg-neutral-900 dark:bg-neutral-100 text-white text-sm px-4 py-2 rounded-lg hover:bg-neutral-900 dark:bg-neutral-100-dark transition-colors"
          >
            ＋ 新增文章
          </Link>
        </div>
      </div>

      {/* 搜尋 + 篩選 + 排序 */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜尋標題、slug、分類..."
            className="w-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-neutral-900 dark:focus:border-neutral-400 transition-colors"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
          className="border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-neutral-900 dark:focus:border-neutral-400"
        >
          <option value="all">全部狀態</option>
          <option value="published">已發佈</option>
          <option value="draft">草稿</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-neutral-900 dark:focus:border-neutral-400"
        >
          <option value="newest">最新優先</option>
          <option value="oldest">最舊優先</option>
          <option value="title">標題排序</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-16 text-neutral-400 dark:text-neutral-500">
          <p className="text-sm">載入中...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-neutral-400 dark:text-neutral-500">
          <p className="text-lg mb-2">{search ? "找不到符合的文章" : "還沒有文章"}</p>
          {!search && (
            <Link href="/admin/posts/new" className="text-sm text-neutral-900 dark:text-neutral-100">
              新增第一篇文章 →
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 dark:text-neutral-400">狀態</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 dark:text-neutral-400">標題</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 dark:text-neutral-400">分類</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 dark:text-neutral-400">建立時間</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500 dark:text-neutral-400">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr key={post.id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                  <td className="px-4 py-3">
                    {post.published ? (
                      <span className="text-xs bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-0.5 rounded">已發佈</span>
                    ) : (
                      <span className="text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded">草稿</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">{post.title}</span>
                    <span className="text-xs text-neutral-400 dark:text-neutral-500 ml-2">/{post.slug}</span>
                  </td>
                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{post.category.name}</td>
                  <td className="px-4 py-3 text-neutral-400 dark:text-neutral-500 text-xs">
                    {new Date(post.createdAt).toLocaleDateString("zh-TW")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/posts/${post.slug}`}
                        className="text-xs text-neutral-400 hover:text-neutral-900 dark:text-neutral-100 transition-colors"
                      >
                        預覽
                      </Link>
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="text-xs text-neutral-900 dark:text-neutral-100 hover:text-neutral-900 dark:text-neutral-100-dark transition-colors"
                      >
                        編輯
                      </Link>
                      <button
                        onClick={() => handleTogglePublish(post.id)}
                        className={`text-xs transition-colors ${
                          post.published
                            ? "text-yellow-500 hover:text-yellow-700"
                            : "text-green-500 hover:text-green-700"
                        }`}
                      >
                        {post.published ? "取消發佈" : "發佈"}
                      </button>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors"
                      >
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
