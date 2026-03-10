"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * 文章操作按鈕 — 發佈切換 + 刪除
 * Client Component，放在後台文章列表的每一行
 */
type PostActionsProps = {
  postId: number;
  published: boolean;
  postTitle: string;
};

export default function PostActions({
  postId,
  published,
  postTitle,
}: PostActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 切換發佈狀態
  async function handleTogglePublish() {
    setLoading(true);
    await fetch(`/api/posts/${postId}/publish`, { method: "PATCH" });
    router.refresh(); // 重新載入 Server Component 資料
    setLoading(false);
  }

  // 刪除文章
  async function handleDelete() {
    if (!confirm(`確定要刪除「${postTitle}」嗎？此操作無法復原。`)) return;

    setLoading(true);
    await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleTogglePublish}
        disabled={loading}
        className={`text-xs transition-colors disabled:opacity-50 ${
          published
            ? "text-yellow-500 hover:text-yellow-700"
            : "text-green-500 hover:text-green-700"
        }`}
      >
        {published ? "取消發佈" : "發佈"}
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
      >
        刪除
      </button>
    </div>
  );
}
