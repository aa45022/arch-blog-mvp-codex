"use client";

import { useState, useRef } from "react";
import Image from "next/image";

type ImageUploaderProps = {
  value: string;
  onChange: (url: string) => void;
};

export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(""); setUploading(true);

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "上傳失敗");
    } else {
      onChange(data.url);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="space-y-2">
      {/* 模式切換 */}
      <div className="flex gap-3 text-xs">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`transition-colors ${mode === "upload" ? "text-accent font-medium" : "text-gray-400 hover:text-gray-600"}`}
        >
          📁 上傳圖片
        </button>
        <span className="text-gray-200">|</span>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`transition-colors ${mode === "url" ? "text-accent font-medium" : "text-gray-400 hover:text-gray-600"}`}
        >
          🔗 貼上網址
        </button>
      </div>

      {mode === "upload" ? (
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-accent transition-colors group"
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          {uploading ? (
            <p className="text-sm text-gray-400">上傳中...</p>
          ) : (
            <>
              <p className="text-2xl mb-1">🖼️</p>
              <p className="text-xs text-gray-400 group-hover:text-accent transition-colors">
                點擊選擇圖片（JPG / PNG，最大 5MB）
              </p>
            </>
          )}
        </div>
      ) : (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
        />
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* 預覽 */}
      {value && (
        <div className="relative">
          <Image
            src={value}
            alt="封面圖預覽"
            width={800}
            height={400}
            className="w-full h-36 object-cover rounded border border-gray-200"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-white/80 text-gray-500 text-xs px-2 py-1 rounded hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            移除
          </button>
        </div>
      )}
    </div>
  );
}
