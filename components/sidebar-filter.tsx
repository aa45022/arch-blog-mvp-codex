"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Filter, X } from "lucide-react";

type SidebarFilterProps = {
  categories: { name: string; slug: string }[];
  tags: { name: string; slug: string }[];
  totalCount: number;
  totalViews: number;
};

export default function SidebarFilter({
  categories,
  tags,
  totalCount,
  totalViews,
}: SidebarFilterProps) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");
  const activeTag = searchParams.get("tag");
  const [mobileOpen, setMobileOpen] = useState(false);

  function buildHref(key: string, value: string | null): string {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    if (key === "category") params.delete("tag");
    if (key === "tag") params.delete("category");
    params.delete("page");
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  }

  const filterContent = (
    <>
      {/* 數據統計 */}
      <div className="mb-8 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <p className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.2em] mb-3">
          Stats
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
              {totalCount}
            </p>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-600">篇文章</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
              {totalViews.toLocaleString()}
            </p>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-600">次閱讀</p>
          </div>
        </div>
      </div>

      {/* 分類 */}
      <div className="mb-6">
        <p className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.2em] mb-3">
          分類 Categories
        </p>
        <ul className="space-y-1">
          <li>
            <Link
              href={buildHref("category", null)}
              onClick={() => setMobileOpen(false)}
              className={`block text-xs py-1.5 transition-colors ${
                !activeCategory && !activeTag
                  ? "text-neutral-900 dark:text-neutral-100 font-medium"
                  : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
              }`}
            >
              全部文章
            </Link>
          </li>
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={buildHref("category", cat.slug)}
                onClick={() => setMobileOpen(false)}
                className={`block text-xs py-1.5 transition-colors ${
                  activeCategory === cat.slug
                    ? "text-neutral-900 dark:text-neutral-100 font-medium"
                    : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
                }`}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 標籤 */}
      {tags.length > 0 && (
        <div className="mb-6">
          <p className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.2em] mb-3">
            標籤 Tags
          </p>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Link
                key={tag.slug}
                href={buildHref("tag", tag.slug)}
                onClick={() => setMobileOpen(false)}
                className={`text-[10px] px-2 py-1 border transition-colors ${
                  activeTag === tag.slug
                    ? "bg-neutral-900 text-white border-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 dark:border-neutral-100"
                    : "text-neutral-400 dark:text-neutral-600 border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 hover:text-neutral-900 dark:hover:border-neutral-400 dark:hover:text-neutral-200"
                }`}
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 清除篩選 */}
      {(activeCategory || activeTag) && (
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="text-xs text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
        >
          ✕ 清除篩選
        </Link>
      )}
    </>
  );

  return (
    <>
      {/* 手機版按鈕 */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 px-3 py-2 hover:border-neutral-900 dark:hover:border-neutral-400 transition-colors mb-6"
      >
        {mobileOpen ? <X className="w-3 h-3" /> : <Filter className="w-3 h-3" />}
        {mobileOpen ? "關閉篩選" : "篩選與分類"}
      </button>

      {/* 手機版面板 */}
      {mobileOpen && (
        <div className="lg:hidden mb-8 p-4 border border-neutral-200 dark:border-neutral-800">
          {filterContent}
        </div>
      )}

      {/* 桌面版側邊欄 */}
      <aside className="hidden lg:block lg:sticky lg:top-8">
        {filterContent}
      </aside>
    </>
  );
}
