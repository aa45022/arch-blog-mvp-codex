import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-6xl font-bold text-neutral-200 dark:text-neutral-800 mb-4 tracking-tighter">404</p>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-2">頁面不存在</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">
            你要找的頁面可能已被移除或不存在。
          </p>
          <Link
            href="/"
            className="text-xs bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-5 py-2.5 hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors uppercase tracking-wider font-medium"
          >
            ← 返回首頁
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
