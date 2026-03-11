"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MarkdownEditor from "@/components/markdown-editor";
import ImageUploader from "@/components/image-uploader";

type PostFormProps = { postId?: number };
type Category = { id: number; name: string; slug: string };
type Tag = { id: number; name: string; slug: string };

export default function PostForm({ postId }: PostFormProps) {
  const router = useRouter();
  const isEdit = !!postId;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [published, setPublished] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // 快速新增分類
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState("");

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

  useEffect(() => { loadOptions(); }, []);

  useEffect(() => {
    if (!postId) return;
    setLoading(true);
    fetch(`/api/posts/${postId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.data) {
          const p = data.data;
          setTitle(p.title); setSlug(p.slug); setExcerpt(p.excerpt);
          setContent(p.content); setCoverImage(p.coverImage || "");
          setCategoryId(p.categoryId);
          setSelectedTagIds(p.tags.map((t: Tag) => t.id));
          setPublished(p.published);
        }
        setLoading(false);
      });
  }, [postId]);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!isEdit && !slug) {
      const autoSlug = value
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fff]+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(autoSlug);
    }
  }

  function toggleTag(tagId: number) {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  }

  async function handleAddCategory() {
    if (!newCategoryName.trim()) return;
    setCategoryError(""); setAddingCategory(true);

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategoryName.trim() }),
    });
    const data = await res.json();

    if (!res.ok) {
      setCategoryError(data.error || "新增失敗");
    } else {
      await loadOptions();
      setCategoryId(data.data.id);
      setNewCategoryName("");
      setShowAddCategory(false);
    }
    setAddingCategory(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!title || !slug || !excerpt || !content || !categoryId) {
      setError("請填寫所有必填欄位");
      return;
    }
    setSaving(true);

    try {
      const body = { title, slug, excerpt, content, coverImage: coverImage || null,
        categoryId: Number(categoryId), tagIds: selectedTagIds, published };
      const url = isEdit ? `/api/posts/${postId}` : "/api/posts";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "儲存失敗"); setSaving(false); return; }
      router.push("/admin/posts");
      router.refresh();
    } catch {
      setError("儲存時發生錯誤");
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-8"><p className="text-sm text-neutral-400">載入中...</p></div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-lg font-bold text-neutral-900 mb-6">{isEdit ? "編輯文章" : "新增文章"}</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 標題 */}
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1.5">標題 <span className="text-red-400">*</span></label>
          <input type="text" value={title} onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="文章標題"
            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:focus:border-neutral-400 transition-colors" />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1.5">網址代稱 <span className="text-red-400">*</span></label>
          <div className="flex items-center gap-1 text-xs text-neutral-400 mb-1">
            <span>/posts/</span><span className="text-neutral-900 dark:text-neutral-100">{slug || "..."}</span>
          </div>
          <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)}
            placeholder="url-friendly-slug"
            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:focus:border-neutral-400 transition-colors font-mono" />
        </div>

        {/* 摘要 */}
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1.5">摘要 <span className="text-red-400">*</span></label>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
            placeholder="文章簡短描述，顯示於首頁卡片" rows={2}
            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:focus:border-neutral-400 transition-colors resize-y" />
        </div>

        {/* 分類 + 發佈狀態 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-neutral-500">分類 <span className="text-red-400">*</span></label>
              <button type="button" onClick={() => { setShowAddCategory(!showAddCategory); setCategoryError(""); }}
                className="text-xs text-neutral-900 dark:text-neutral-100 hover:text-neutral-900 dark:text-neutral-100-dark transition-colors">
                {showAddCategory ? "取消" : "+ 新增分類"}
              </button>
            </div>

            {showAddCategory ? (
              <div className="space-y-1">
                <div className="flex gap-1">
                  <input type="text" value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCategory())}
                    placeholder="新分類名稱"
                    className="flex-1 border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:focus:border-neutral-400 transition-colors" />
                  <button type="button" onClick={handleAddCategory} disabled={addingCategory}
                    className="bg-neutral-900 dark:bg-neutral-100 text-white text-xs px-3 py-2 rounded-lg hover:bg-neutral-900 dark:bg-neutral-100-dark disabled:opacity-50">
                    {addingCategory ? "..." : "新增"}
                  </button>
                </div>
                {categoryError && <p className="text-xs text-red-500">{categoryError}</p>}
              </div>
            ) : (
              <select value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:focus:border-neutral-400 transition-colors">
                <option value="">請選擇分類</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1.5">發佈狀態</label>
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)}
                className="accent-neutral-900 dark:accent-neutral-200" />
              <span className="text-sm text-neutral-700">{published ? "已發佈" : "草稿"}</span>
            </label>
          </div>
        </div>

        {/* 標籤 */}
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1.5">標籤</label>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <button key={tag.id} type="button" onClick={() => toggleTag(tag.id)}
                className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                  selectedTagIds.includes(tag.id)
                    ? "bg-neutral-900 dark:bg-neutral-100 text-white border-neutral-900 dark:border-neutral-100"
                    : "text-neutral-400 border-neutral-200 hover:border-neutral-900 dark:border-neutral-100"
                }`}>
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        {/* 封面圖 */}
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1.5">封面圖（選填）</label>
          <ImageUploader value={coverImage} onChange={setCoverImage} />
        </div>

        {/* 內容 */}
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1.5">內容 <span className="text-red-400">*</span></label>
          <MarkdownEditor value={content} onChange={setContent} />
        </div>

        {error && <p className="text-xs text-red-500 bg-red-50 rounded px-3 py-2">{error}</p>}

        <div className="flex items-center gap-3 pt-4 border-t border-neutral-200">
          <button type="submit" disabled={saving}
            className="bg-neutral-900 dark:bg-neutral-100 text-white text-sm px-6 py-2.5 rounded-lg hover:bg-neutral-900 dark:bg-neutral-100-dark transition-colors disabled:opacity-50">
            {saving ? "儲存中..." : isEdit ? "更新文章" : "建立文章"}
          </button>
          <button type="button" onClick={() => router.push("/admin/posts")}
            className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors">
            取消
          </button>
        </div>
      </form>
    </div>
  );
}
