import Link from "next/link";

/**
 * 頂部導覽列
 */
export default function Header() {
  return (
    <header className="border-b border-gray-200">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo / 網站名稱 */}
        <Link href="/" className="hover:opacity-80">
          <h1 className="text-lg font-bold text-gray-900 tracking-wide">
            建築學習筆記
          </h1>
          <p className="text-xs text-gray-400 tracking-wider">
            ARCHITECTURE STUDY NOTES
          </p>
        </Link>

        {/* 導覽連結 */}
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/"
            className="text-gray-500 hover:text-accent transition-colors"
          >
            首頁
          </Link>
          <Link
            href="/?category=site-planning"
            className="text-gray-500 hover:text-accent transition-colors hidden sm:block"
          >
            敷地計畫
          </Link>
          <Link
            href="/?category=urban-design"
            className="text-gray-500 hover:text-accent transition-colors hidden sm:block"
          >
            都市設計
          </Link>
        </nav>
      </div>
    </header>
  );
}
