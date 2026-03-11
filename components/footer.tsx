import Link from "next/link";

/**
 * SITE LAB Footer — 含 RSS 連結
 */
export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="text-center sm:text-left">
          <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100 tracking-tight mb-0.5 font-display">
            SITE LAB
          </p>
          <p className="text-[10px] text-neutral-400 dark:text-neutral-500 tracking-wider font-serif">
            敷地實驗室 — 僅供學習參考
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/feed.xml"
            className="text-[10px] text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors uppercase tracking-wider"
          >
            RSS
          </Link>
          <Link
            href="/sitemap.xml"
            className="text-[10px] text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors uppercase tracking-wider"
          >
            Sitemap
          </Link>
        </div>
      </div>
    </footer>
  );
}
