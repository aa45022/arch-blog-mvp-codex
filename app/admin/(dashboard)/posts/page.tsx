"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Search, Plus, Copy, Trash2, Eye, Edit3, ToggleLeft, ToggleRight, Check, X } from "lucide-react";

type Post = {
  id: number;
  title: string;
  slug: string;
  published: boolean;
  featured: boolean;
  coverImage: string | null;
  viewCount: number;
  createdAt: string;
  category: { name: string };
};

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filtered, setFiltered] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title" | "views">("newest");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");

  async function loadPosts() {
    setLoading(true);
    const res = await fetch("/api/posts");
    const data = await res.json();
    if (data.data) setPosts(data.data);
    setLoading(false);
  }

  useEffect(() => { loadPosts(); }, []);

  useEffect(() => {
    let result = [...posts];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) =>
        p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q) || p.category.name.toLowerCase().includes(q)
      );
    }
    if (filterStatus === "published") result = result.filter((p) => p.published);
    if (filterStatus === "draft") result = result.filter((p) => !p.published);
    if (sortBy === "newest") result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (sortBy === "oldest") result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    if (sortBy === "title") result.sort((a, b) => a.title.localeCompare(b.title, "zh-TW"));
    if (sortBy === "views") result.sort((a, b) => b.viewCount - a.viewCount);
    setFiltered(result);
  }, [posts, search, sortBy, filterStatus]);

  // 全選/取消
  function toggleSelectAll() {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((p) => p.id)));
    }
  }
  function toggleSelect(id: number) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  }

  // 批次操作
  async function batchAction(action: "publish" | "unpublish" | "delete") {
    if (selectedIds.size === 0) return;
    if (action === "delete" && !confirm(`確定要刪除 ${selectedIds.size} 篇文章嗎？`)) return;
    await fetch("/api/posts/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selectedIds), action }),
    });
    setSelectedIds(new Set());
    await loadPosts();
  }

  // 複製文章
  async function handleDuplicate(id: number) {
    await fetch(`/api/posts/${id}/duplicate`, { method: "POST" });
    await loadPosts();
  }

  // 快速編輯標題
  function startEditTitle(post: Post) {
    setEditingId(post.id);
    setEditTitle(post.title);
  }
  async function saveEditTitle(id: number) {
    if (!editTitle.trim()) return;
    await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle.trim(), quickEdit: true }),
    });
    setEditingId(null);
    await loadPosts();
  }

  async function handleTogglePublish(id: number) {
    await fetch(`/api/posts/${id}/publish`, { method: "PATCH" });
    await loadPosts();
  }

  async function handleDelete(id: number, title: string) {
    if (!confirm(`確定要刪除「${title}」嗎？`)) return;
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    await loadPosts();
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 font-serif tracking-wide">文章管理</h1>
          <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-1">
            共 {posts.length} 篇 · {posts.filter(p => p.published).length} 已發佈 · {posts.filter(p => !p.published).length} 草稿
          </p>
        </div>
        <Link href="/admin/posts/new"
          className="flex items-center gap-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-medium px-4 py-2.5 hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors">
          <Plus className="w-3.5 h-3.5" /> 新增文章
        </Link>
      </div>

      {/* 搜尋 + 篩選 */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜尋標題、slug、分類..."
            className="w-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 pl-9 pr-3 py-2 text-sm outline-none focus:border-neutral-900 dark:focus:border-neutral-400 transition-colors" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
          className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 px-3 py-2 text-xs outline-none">
          <option value="all">全部狀態</option>
          <option value="published">已發佈</option>
          <option value="draft">草稿</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 px-3 py-2 text-xs outline-none">
          <option value="newest">最新優先</option>
          <option value="oldest">最舊優先</option>
          <option value="title">標題排序</option>
          <option value="views">閱讀數排序</option>
        </select>
      </div>

      {/* 批次操作列 */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 mb-4 px-4 py-3 border border-neutral-900 dark:border-neutral-100 bg-neutral-50 dark:bg-neutral-900">
          <span className="text-xs text-neutral-900 dark:text-neutral-100 font-medium">已選 {selectedIds.size} 篇</span>
          <div className="flex-1" />
          <button onClick={() => batchAction("publish")} className="text-xs text-green-600 hover:text-green-800 transition-colors">批次發佈</button>
          <button onClick={() => batchAction("unpublish")} className="text-xs text-yellow-600 hover:text-yellow-800 transition-colors">批次取消發佈</button>
          <button onClick={() => batchAction("delete")} className="text-xs text-red-500 hover:text-red-700 transition-colors">批次刪除</button>
          <button onClick={() => setSelectedIds(new Set())} className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors">取消</button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16"><p className="text-sm text-neutral-400 animate-pulse">載入中...</p></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">
          <p className="text-base mb-2">{search ? "找不到符合的文章" : "還沒有文章"}</p>
          {!search && <Link href="/admin/posts/new" className="text-sm text-neutral-900 dark:text-neutral-100">新增第一篇文章 →</Link>}
        </div>
      ) : (
        <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                <th className="w-8 px-3 py-3">
                  <input type="checkbox" checked={selectedIds.size === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll} className="accent-neutral-900 dark:accent-neutral-200" />
                </th>
                <th className="w-10 px-2 py-3"></th>
                <th className="text-left px-3 py-3 text-xs font-medium text-neutral-500 dark:text-neutral-400">標題</th>
                <th className="text-left px-3 py-3 text-xs font-medium text-neutral-500 dark:text-neutral-400 hidden sm:table-cell">分類</th>
                <th className="text-left px-3 py-3 text-xs font-medium text-neutral-500 dark:text-neutral-400 hidden md:table-cell">閱讀</th>
                <th className="text-left px-3 py-3 text-xs font-medium text-neutral-500 dark:text-neutral-400 hidden lg:table-cell">日期</th>
                <th className="text-right px-3 py-3 text-xs font-medium text-neutral-500 dark:text-neutral-400">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr key={post.id} className={`border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 ${selectedIds.has(post.id) ? "bg-neutral-50 dark:bg-neutral-800/30" : ""}`}>
                  <td className="px-3 py-3">
                    <input type="checkbox" checked={selectedIds.has(post.id)} onChange={() => toggleSelect(post.id)}
                      className="accent-neutral-900 dark:accent-neutral-200" />
                  </td>
                  {/* 縮圖 */}
                  <td className="px-2 py-3">
                    <div className="w-10 h-7 bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                      {post.coverImage ? (
                        <Image src={post.coverImage} alt="" width={40} height={28} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] text-neutral-300 dark:text-neutral-700">—</div>
                      )}
                    </div>
                  </td>
                  {/* 標題 + 狀態 */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2 mb-0.5">
                      {post.published ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" title="已發佈" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600 shrink-0" title="草稿" />
                      )}
                      {post.featured && <span className="text-[10px]" title="精選">⭐</span>}
                      {editingId === post.id ? (
                        <div className="flex items-center gap-1 flex-1">
                          <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") saveEditTitle(post.id); if (e.key === "Escape") setEditingId(null); }}
                            autoFocus
                            className="flex-1 border border-neutral-300 dark:border-neutral-700 px-2 py-1 text-xs outline-none bg-white dark:bg-neutral-950" />
                          <button onClick={() => saveEditTitle(post.id)} className="text-green-500"><Check className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setEditingId(null)} className="text-neutral-400"><X className="w-3.5 h-3.5" /></button>
                        </div>
                      ) : (
                        <span className="font-medium text-neutral-900 dark:text-neutral-100 truncate cursor-pointer hover:opacity-60"
                          onDoubleClick={() => startEditTitle(post)}>
                          {post.title}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-600">/{post.slug}</span>
                  </td>
                  <td className="px-3 py-3 text-xs text-neutral-500 dark:text-neutral-400 hidden sm:table-cell">{post.category.name}</td>
                  <td className="px-3 py-3 text-xs text-neutral-400 dark:text-neutral-600 hidden md:table-cell">{post.viewCount.toLocaleString()}</td>
                  <td className="px-3 py-3 text-xs text-neutral-400 dark:text-neutral-600 hidden lg:table-cell">{new Date(post.createdAt).toLocaleDateString("zh-TW")}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/posts/${post.slug}`} title="預覽" className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <Link href={`/admin/posts/${post.id}/edit`} title="編輯" className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
                        <Edit3 className="w-3.5 h-3.5" />
                      </Link>
                      <button onClick={() => handleDuplicate(post.id)} title="複製" className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleTogglePublish(post.id)} title={post.published ? "取消發佈" : "發佈"}
                        className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
                        {post.published ? <ToggleRight className="w-3.5 h-3.5 text-green-500" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => handleDelete(post.id, post.title)} title="刪除"
                        className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-[10px] text-neutral-300 dark:text-neutral-700 mt-3">💡 雙擊標題可快速編輯</p>
    </div>
  );
}
