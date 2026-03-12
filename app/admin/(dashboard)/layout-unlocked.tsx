import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";
import { FileText, FolderOpen, BarChart3, Image as ImageIcon, Home, ExternalLink } from "lucide-react";

/**
 * ⚠️ 無鎖版 Dashboard Layout — 不做認證檢查
 * 正式環境請用原版 layout.tsx
 */
export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 不做 validateSession()，直接渲染

  const navItems = [
    { href: "/admin", icon: Home, label: "總覽" },
    { href: "/admin/posts", icon: FileText, label: "文章管理" },
    { href: "/admin/categories", icon: FolderOpen, label: "分類管理" },
    { href: "/admin/media", icon: ImageIcon, label: "媒體庫" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex">
      {/* 側邊欄 */}
      <aside className="hidden md:flex w-56 flex-col bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 fixed inset-y-0 left-0 z-20">
        <div className="px-5 py-5 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100 tracking-tight font-display">
              SITE LAB
            </span>
            <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.5 uppercase tracking-wider font-medium">
              TEST
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-neutral-200 dark:border-neutral-800 space-y-1">
          <Link href="/"
            className="flex items-center gap-3 px-3 py-2 text-xs text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
            <ExternalLink className="w-3.5 h-3.5" />
            前台預覽
          </Link>
          <div className="flex items-center px-3 py-2">
            <ThemeToggle />
          </div>
          <p className="px-3 text-[10px] text-red-400">⚠️ 無鎖測試版 — 無需登入</p>
        </div>
      </aside>

      <header className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100 font-display">SITE LAB</span>
          <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.5 uppercase tracking-wider">TEST</span>
        </div>
        <nav className="flex items-center gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} title={item.label}
                className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
                <Icon className="w-4 h-4" />
              </Link>
            );
          })}
          <ThemeToggle />
        </nav>
      </header>

      <main className="flex-1 md:ml-56 mt-14 md:mt-0">
        {children}
      </main>
    </div>
  );
}
