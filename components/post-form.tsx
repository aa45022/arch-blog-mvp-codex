"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MarkdownEditor from "@/components/markdown-editor";
import ImageUploader from "@/components/image-uploader";

/**
 * 文章表單 — 新增 / 編輯共用
 */
type PostFormProps = {
  postId?: number; // 有值 = 編輯模式
};

type Category = { id: number; name: string; slug: string };
type Tag = { id: number; name: string; slug: string };

export default function PostForm({ postId }: PostFormProps) {
  const router = useRouter();
  const isEdit = !!postId;

  // 表單狀態
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [published, setPublished] = useState(false);

  // 選項資料
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  // UI 狀態
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ─── 載入分類 + 標籤 ───
  useEffect(() => {
    async function loadOptions() {
      const [catRes, tagRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/tags"),
      ]);
      const catData = await catRes.json();
      const tagData = await tagRes.json();
      if (catData.data) setCategories(catData.data);
      if (tagData.data) setTags(tagData.data);
    }
    loadOptions();
  }, []);

  // ─── 編輯模式：載入文章資料 ───
  useEffect(() => {
    if (!postId) return;
    setLoading(true);

    async function loadPost() {
      const res = await fetch(`/api/posts/${postId}`);
      const data = await res.json();

      if (data.data) {
        const p = data.data;
        setTitle(p.title);
        setSlug(p.slug);
        setExcerpt(p.excerpt);
        setContent(p.content);
        setCoverImage(p.coverImage || "");
        setCategoryId(p.categoryId);
        setSelectedTagIds(p.tags.map((t: Tag) => t.id));
        setPublished(p.published);
      }
      setLoading(false);
    }
    loadPost();
  }, [postId]);

  // ─── 自動產生 slug ───
  function handleTitleChange(value: string) {
    setTitle(value);
    // 只在新增模式且 slug 沒被手動改過時自動產生
    if (!isEdit && !slug) {
      const autoSlug = value
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fff]+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(autoSlug);
    }
  }

  // ─── 標籤 toggle ───
  function toggleTag(tagId: number) {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  }

  // ─── 送出 ───
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title || !slug || !excerpt || !content || !categoryId) {
      setError("請填寫所有必填欄位");
      return;
    }

    setSaving(true);

    try {
      const body = {
        title,
        slug,
        excerpt,
        content,
        coverImage: coverImage || null,
        categoryId: Number(categoryId),
        tagIds: selectedTagIds,
        published,
      };

      const url = isEdit ? `/api/posts/${postId}` : "/api/posts";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "儲存失敗");
        setSaving(false);
        return;
      }

      // 成功 → 導回文章列表
      router.push("/admin/posts");
    } catch {
      setError("儲存時發生錯誤");
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-sm text-gray-400">載入中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-lg font-bold text-gray-900 mb-6">
        {isEdit ? "編輯文章" : "新增文章"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 標題 */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            標題 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="文章標題"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            網址代稱 <span className="text-red-400">*</span>
          </label>
          <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
            <span>/posts/</span>
            <span className="text-accent">{slug || "..."}</span>
          </div>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="url-friendly-slug"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent transition-colors font-mono"
          />
        </div>

        {/* 摘要 */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            摘要 <span className="text-red-400">*</span>
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="文章簡短描述，顯示於首頁卡片"
            rows={2}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent transition-colors resize-y"
          />
        </div>

        {/* 分類 + 發佈狀態 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              分類 <span className="text-red-400">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
            >
              <option value="">請選擇分類</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              發佈狀態
            </label>
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="accent-accent"
              />
              <span className="text-sm text-gray-700">
                {published ? "已發佈" : "草稿"}
              </span>
            </label>
          </div>
        </div>

        {/* 標籤 */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            標籤
          </label>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                  selectedTagIds.includes(tag.id)
                    ? "bg-accent text-white border-accent"
                    : "text-gray-400 border-gray-200 hover:border-accent"
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        {/* 封面圖 */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            封面圖（選填）
          </label>
          <ImageUploader value={coverImage} onChange={setCoverImage} />
        </div>

        {/* 內容 — Markdown 編輯器 */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            內容 <span className="text-red-400">*</span>
          </label>
          <MarkdownEditor value={content} onChange={setContent} />
        </div>

        {/* 錯誤訊息 */}
        {error && (
          <p className="text-xs text-red-500 bg-red-50 rounded px-3 py-2">
            {error}
          </p>
        )}

        {/* 按鈕列 */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="bg-accent text-white text-sm px-6 py-2.5 rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-50"
          >
            {saving ? "儲存中..." : isEdit ? "更新文章" : "建立文章"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/posts")}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
}
