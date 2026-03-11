import Link from "next/link";
import LogoutButton from "@/components/logout-button";
import ThemeToggle from "@/components/theme-toggle";

/**
 * Admin Layout — 後台共用外框
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* 後台導覽列 */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* 左側 */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin/posts"
              className="text-sm font-bold text-gray-900 dark:text-gray-100"
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
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-accent transition-colors"
            >
              文章管理
            </Link>
            <Link
              href="/"
              className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              前台
            </Link>
            <ThemeToggle />
            <LogoutButton />
          </nav>
        </div>
      </header>

      {/* 內容區 */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
