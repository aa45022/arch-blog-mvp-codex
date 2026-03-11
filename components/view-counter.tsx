"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

type ViewCounterProps = {
  postId: number;
  initialCount: number;
};

/**
 * 閱讀數計數器 — mount 時 +1，顯示總數
 */
export default function ViewCounter({ postId, initialCount }: ViewCounterProps) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    // 用 sessionStorage 避免同一 session 重複計數
    const key = `viewed-${postId}`;
    if (sessionStorage.getItem(key)) return;

    sessionStorage.setItem(key, "1");
    fetch(`/api/posts/${postId}/view`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (data.viewCount) setCount(data.viewCount);
      })
      .catch(() => {});
  }, [postId]);

  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-neutral-400 dark:text-neutral-600">
      <Eye className="w-3 h-3" />
      {count.toLocaleString()}
    </span>
  );
}
