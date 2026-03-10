import Link from "next/link";

/**
 * 404 頁面 — 找不到頁面時顯示
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl font-bold text-gray-200 mb-4">404</p>
        <h2 className="text-lg font-bold text-gray-900 mb-2">頁面不存在</h2>
        <p className="text-sm text-gray-500 mb-4">
          你要找的頁面可能已被移除或不存在。
        </p>
        <Link
          href="/"
          className="text-sm text-accent hover:text-accent-dark"
        >
          ← 返回首頁
        </Link>
      </div>
    </div>
  );
}
