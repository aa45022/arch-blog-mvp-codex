"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Upload, Trash2, Copy, Check, Image as ImageIcon } from "lucide-react";

type MediaItem = {
  id: number;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  createdAt: string;
};

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function loadMedia() {
    setLoading(true);
    const res = await fetch("/api/media");
    const data = await res.json();
    if (data.data) setMedia(data.data);
    setLoading(false);
  }

  useEffect(() => { loadMedia(); }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);

    for (const file of files) {
      const form = new FormData();
      form.append("file", file);
      await fetch("/api/upload", { method: "POST", body: form });
    }

    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    await loadMedia();
  }

  async function handleDelete(id: number) {
    if (!confirm("確定要從媒體庫移除嗎？")) return;
    await fetch("/api/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await loadMedia();
  }

  function handleCopyUrl(id: number, url: string) {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 font-serif tracking-wide">媒體庫</h1>
          <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-1">
            共 {media.length} 個檔案 · 點擊圖片可複製 URL
          </p>
        </div>
        <div>
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            className="flex items-center gap-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-medium px-4 py-2.5 hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors disabled:opacity-50">
            <Upload className="w-3.5 h-3.5" />
            {uploading ? "上傳中..." : "上傳圖片"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20"><p className="text-sm text-neutral-400 animate-pulse">載入中...</p></div>
      ) : media.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-neutral-200 dark:border-neutral-800">
          <ImageIcon className="w-8 h-8 text-neutral-200 dark:text-neutral-800 mx-auto mb-4" />
          <p className="text-sm text-neutral-400 mb-2">媒體庫是空的</p>
          <p className="text-xs text-neutral-300 dark:text-neutral-700">上傳圖片或在編輯文章時拖拽圖片</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map((item) => (
            <div key={item.id} className="group relative border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
              <div className="aspect-square overflow-hidden">
                <Image src={item.url} alt={item.filename} width={200} height={200}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button onClick={() => handleCopyUrl(item.id, item.url)} title="複製 URL"
                  className="w-8 h-8 flex items-center justify-center bg-white/90 text-neutral-700 hover:bg-white transition-colors">
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => handleDelete(item.id)} title="刪除"
                  className="w-8 h-8 flex items-center justify-center bg-white/90 text-neutral-700 hover:bg-red-50 hover:text-red-500 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {/* Info */}
              <div className="px-2 py-2">
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">{item.filename}</p>
                <p className="text-[10px] text-neutral-300 dark:text-neutral-700">{formatSize(item.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
