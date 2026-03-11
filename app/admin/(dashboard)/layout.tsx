import Link from "next/link";
import { redirect } from "next/navigation";
import { validateSession } from "@/lib/auth";
import LogoutButton from "@/components/logout-button";
import ThemeToggle from "@/components/theme-toggle";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await validateSession();
  if (!auth) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col">
      <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/posts" className="text-sm font-bold text-neutral-900 dark:text-neutral-100 tracking-tight font-display">
              SITE LAB
            </Link>
            <span className="text-[10px] bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-2 py-0.5 uppercase tracking-wider font-medium">後台</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/admin/posts" className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
              文章管理
            </Link>
            <Link href="/admin/categories" className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
              分類管理
            </Link>
            <Link href="/" className="text-xs text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
              前台
            </Link>
            <ThemeToggle />
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
