import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-5xl font-bold text-gray-200 dark:text-gray-700 mb-4">404</p>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">頁面不存在</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            你要找的頁面可能已被移除或不存在。
          </p>
          <Link
            href="/"
            className="text-sm bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dark transition-colors"
          >
            ← 返回首頁
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
