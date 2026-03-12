"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/posts");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 text-center">
        <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">後台免登入模式已啟用</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">正在帶你進入後台管理頁...</p>
      </div>
    </div>
  );
}
