"use client";

import { useParams } from "next/navigation";
import PostForm from "@/components/post-form";

/**
 * 編輯文章頁 — /admin/posts/[id]/edit
 * Client Component（需要讀取 URL params）
 */
export default function AdminEditPostPage() {
  const params = useParams();
  const postId = Number(params.id);

  if (!postId || isNaN(postId)) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-sm text-red-500">無效的文章 ID</p>
      </div>
    );
  }

  return <PostForm postId={postId} />;
}
