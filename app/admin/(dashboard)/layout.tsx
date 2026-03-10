import Link from "next/link";
import LogoutButton from "@/components/logout-button";

/**
 * Admin Layout — 後台共用外框
 * Server Component，登出按鈕為獨立 Client Component
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 後台導覽列 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* 左側 */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin/posts"
              className="text-sm font-bold text-gray-900"
            >
              建築學習筆記
            </Link>
            <span className="text-xs bg-accent text-white px-2 py-0.5 rounded">
              後台
            </span>
          </div>

          {/* 右側 */}
          <nav className="flex items-center gap-4">
            <Link
              href="/admin/posts"
              className="text-sm text-gray-500 hover:text-accent transition-colors"
            >
              文章管理
            </Link>
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              前台
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>

      {/* 內容區 */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
