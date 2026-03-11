import Link from "next/link";
import ThemeToggle from "./theme-toggle";

/**
 * SITE LAB 頂部導覽列 — 建築雜誌風
 */
export default function Header() {
  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
      <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="hover:opacity-70 transition-opacity">
          <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight leading-none">
            SITE LAB
          </h1>
          <p className="text-[10px] text-neutral-400 dark:text-neutral-500 tracking-[0.2em] mt-0.5">
            敷地實驗室
          </p>
        </Link>

        {/* 導覽連結 */}
        <nav className="flex items-center gap-5 text-xs">
          <Link
            href="/"
            className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors uppercase tracking-wider"
          >
            首頁
          </Link>
          <Link
            href="/?category=site-planning"
            className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors uppercase tracking-wider hidden sm:block"
          >
            敷地計畫
          </Link>
          <Link
            href="/?category=urban-design"
            className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors uppercase tracking-wider hidden sm:block"
          >
            都市設計
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
