import Link from "next/link";
import { redirect } from "next/navigation";
import { validateSession } from "@/lib/auth";
import LogoutButton from "@/components/logout-button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 認證守衛：未登入直接導回登入頁
  const auth = await validateSession();
  if (!auth) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/posts" className="text-sm font-bold text-gray-900">
              建築學習筆記
            </Link>
            <span className="text-xs bg-accent text-white px-2 py-0.5 rounded">後台</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/admin/posts" className="text-sm text-gray-500 hover:text-accent transition-colors">
              文章管理
            </Link>
            <Link href="/admin/categories" className="text-sm text-gray-500 hover:text-accent transition-colors">
              分類管理
            </Link>
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              前台
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
