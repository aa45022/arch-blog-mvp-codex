"use client";

import { useState } from "react";

/**
 * 圖片上傳器 — Cloudinary direct upload
 *
 * ⚠️ app-layer validation:
 *   - MIME 類型：image/* 
 *   - 檔案大小：≤ 5MB
 *   Cloudinary 自身有獨立限制
 */
type ImageUploaderProps = {
  value: string; // 目前的圖片 URL
  onChange: (url: string) => void;
};

export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    // ⚠️ app-layer validation: MIME 檢查
    if (!file.type.startsWith("image/")) {
      setError("請選擇圖片檔案");
      return;
    }

    // ⚠️ app-layer validation: 5MB 限制
    if (file.size > 5 * 1024 * 1024) {
      setError("檔案大小不可超過 5MB");
      return;
    }

    setUploading(true);

    try {
      // 1. 取得簽章
      const signRes = await fetch("/api/upload/sign", { method: "POST" });
      const signData = await signRes.json();

      if (!signRes.ok) {
        setError(signData.error || "取得簽章失敗");
        setUploading(false);
        return;
      }

      const { signature, timestamp, cloudName, apiKey, folder } = signData.data;

      // 2. 直接上傳到 Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", String(timestamp));
      formData.append("api_key", apiKey);
      formData.append("folder", folder);
      formData.append("overwrite", "false");
      formData.append("resource_type", "image");

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      );

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        setError(uploadData.error?.message || "上傳失敗");
        setUploading(false);
        return;
      }

      // 3. 回傳 secure_url
      onChange(uploadData.secure_url);
    } catch {
      setError("上傳時發生錯誤");
    }

    setUploading(false);
  }

  return (
    <div>
      {/* 目前圖片預覽 */}
      {value && (
        <div className="mb-2">
          <img
            src={value}
            alt="封面圖預覽"
            className="w-full max-h-48 object-cover rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-red-400 hover:text-red-600 mt-1"
          >
            移除圖片
          </button>
        </div>
      )}

      {/* 上傳按鈕 */}
      <label className="inline-flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-4 py-2 cursor-pointer hover:border-accent transition-colors">
        <span>{uploading ? "上傳中..." : "選擇封面圖"}</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>

      {/* 或手動輸入 URL */}
      <div className="mt-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="或直接貼上圖片 URL"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-accent transition-colors text-gray-500"
        />
      </div>

      {/* 錯誤訊息 */}
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
