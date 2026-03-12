"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * 管理後台入口頁（暫時停用帳密驗證）
 * 依需求先讓團隊可直接進入後台確認功能。
 */
export default function AdminLoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
      <div className="w-full max-w-sm mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight mb-1">SITE LAB</h1>
          <p className="text-[10px] text-neutral-400 dark:text-neutral-500 tracking-[0.2em]">敷地實驗室 — 後台管理</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            目前已暫時關閉後台帳密防護，方便你先快速驗收功能與內容調整。
          </p>

          <button
            type="button"
            onClick={() => router.push("/admin/posts")}
            className="w-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-medium py-2.5 hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors uppercase tracking-wider"
          >
            直接進入後台
          </button>

          <Link
            href="/admin/setup"
            className="block text-center text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
          >
            需要建立/重設管理員資料？前往設定頁
          </Link>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
            ← 返回前台
          </Link>
        </div>
      </div>
    </div>
  );
}
