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
        <h1 className="text-lg font-bold text-gray-900">分類管理</h1>
        <Link href="/admin/posts" className="text-sm text-gray-500 hover:text-accent">
          ← 返回文章管理
        </Link>
      </div>

      {/* 新增分類 */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <h2 className="text-sm font-medium text-gray-700 mb-3">新增分類</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="輸入分類名稱"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
          />
          <button
            onClick={handleAdd}
            disabled={loading || !newName.trim()}
            className="bg-accent text-white text-sm px-4 py-2 rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-50"
          >
            {loading ? "新增中..." : "新增"}
          </button>
        </div>
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        {success && <p className="text-xs text-green-600 mt-2">{success}</p>}
      </div>

      {/* 分類列表 */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {categories.length === 0 ? (
          <p className="text-center py-8 text-gray-400 text-sm">還沒有分類</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">名稱</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Slug</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">文章數</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs font-mono">{cat.slug}</td>
                  <td className="px-4 py-3 text-gray-500">{cat._count.posts} 篇</td>
                  <td className="px-4 py-3 text-right">
                    {cat._count.posts === 0 ? (
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors"
                      >
                        刪除
                      </button>
                    ) : (
                      <span className="text-xs text-gray-300">不可刪除</span>
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
