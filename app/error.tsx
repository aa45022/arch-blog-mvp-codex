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
          <p className="text-5xl font-bold text-gray-200 dark:text-gray-700 mb-4">500</p>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">發生錯誤</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">很抱歉，頁面載入時發生問題。</p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={reset}
              className="text-sm bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dark transition-colors"
            >
              重試
            </button>
            <Link
              href="/"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-accent transition-colors"
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
