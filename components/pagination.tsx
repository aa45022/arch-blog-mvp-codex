"use client";
import { useRouter, useSearchParams } from "next/navigation";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goTo(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className="border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 text-xs px-3 py-1.5 hover:border-neutral-900 hover:text-neutral-900 dark:hover:border-neutral-400 dark:hover:text-neutral-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ← 上一頁
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => goTo(p)}
          className={`text-xs w-8 h-8 border transition-colors ${
            p === currentPage
              ? "bg-neutral-900 text-white border-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 dark:border-neutral-100"
              : "border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:border-neutral-900 hover:text-neutral-900 dark:hover:border-neutral-400 dark:hover:text-neutral-200"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 text-xs px-3 py-1.5 hover:border-neutral-900 hover:text-neutral-900 dark:hover:border-neutral-400 dark:hover:text-neutral-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        下一頁 →
      </button>
    </div>
  );
}
