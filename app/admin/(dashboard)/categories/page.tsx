"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Category = { id: number; name: string; slug: string; _count: { posts: number } };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadCategories() {
    const res = await fetch("/api/categories");
    const data = await res.json();
    if (data.data) setCategories(data.data);
  }

  useEffect(() => { loadCategories(); }, []);

  async function handleAdd() {
    if (!newName.trim()) return;
    setError(""); setSuccess(""); setLoading(true);

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "新增失敗");
    } else {
      setSuccess(`「${newName}」新增成功！`);
      setNewName("");
      await loadCategories();
    }
    setLoading(false);
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`確定要刪除「${name}」分類嗎？`)) return;
    setError(""); setSuccess("");

    const res = await fetch("/api/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "刪除失敗");
    } else {
      setSuccess(`「${name}」已刪除`);
      await loadCategories();
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">分類管理</h1>
        <Link href="/admin/posts" className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:text-neutral-100">
          ← 返回文章管理
        </Link>
      </div>

      {/* 新增分類 */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 mb-6">
        <h2 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">新增分類</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="輸入分類名稱"
            className="flex-1 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:focus:border-neutral-400 transition-colors"
          />
          <button
            onClick={handleAdd}
            disabled={loading || !newName.trim()}
            className="bg-neutral-900 dark:bg-neutral-100 text-white text-sm px-4 py-2 rounded-lg hover:bg-neutral-900 dark:bg-neutral-100-dark transition-colors disabled:opacity-50"
          >
            {loading ? "新增中..." : "新增"}
          </button>
        </div>
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        {success && <p className="text-xs text-green-600 dark:text-green-400 mt-2">{success}</p>}
      </div>

      {/* 分類列表 */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
        {categories.length === 0 ? (
          <p className="text-center py-8 text-neutral-400 dark:text-neutral-500 text-sm">還沒有分類</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 dark:text-neutral-400">名稱</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 dark:text-neutral-400">Slug</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 dark:text-neutral-400">文章數</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500 dark:text-neutral-400">操作</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                  <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">{cat.name}</td>
                  <td className="px-4 py-3 text-neutral-400 dark:text-neutral-500 text-xs font-mono">{cat.slug}</td>
                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{cat._count.posts} 篇</td>
                  <td className="px-4 py-3 text-right">
                    {cat._count.posts === 0 ? (
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="text-xs text-red-400 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      >
                        刪除
                      </button>
                    ) : (
                      <span className="text-xs text-neutral-300 dark:text-neutral-600">不可刪除</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
