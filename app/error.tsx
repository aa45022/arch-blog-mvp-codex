"use client";

import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-6xl font-bold text-neutral-200 dark:text-neutral-800 mb-4 tracking-tighter">500</p>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-2">發生錯誤</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">很抱歉，頁面載入時發生問題。</p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={reset}
              className="text-xs bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-5 py-2.5 hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors uppercase tracking-wider font-medium"
            >
              重試
            </button>
            <Link
              href="/"
              className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
            >
              ← 返回首頁
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
