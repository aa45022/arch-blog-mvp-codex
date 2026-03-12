"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * 管理端目前採「免密碼模式」：
 * 造訪 /admin/login 直接導向 /admin/posts
 */
export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/posts");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
      <p className="text-sm text-neutral-500 dark:text-neutral-400">已啟用免密碼模式，正在前往後台...</p>
    </div>
  );
}
