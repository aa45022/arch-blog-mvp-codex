"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

type TagFilterProps = {
  categories: { name: string; slug: string }[];
  tags: { name: string; slug: string }[];
};

export default function TagFilter({ categories, tags }: TagFilterProps) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");
  const activeTag = searchParams.get("tag");

  function buildHref(key: string, value: string | null): string {
    const params = new URLSearchParams(searchParams.toString());

    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    if (key === "category") params.delete("tag");
    if (key === "tag") params.delete("category");

    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  }

  return (
    <div className="space-y-3">
      {/* 分類 */}
      <div>
        <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 mr-3 uppercase tracking-wider">分類</span>
        <div className="inline-flex flex-wrap gap-1.5">
          <Link
            href={buildHref("category", null)}
            className={`text-xs px-2.5 py-1 border transition-colors ${
              !activeCategory && !activeTag
                ? "bg-neutral-900 text-white border-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 dark:border-neutral-100"
                : "text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 hover:text-neutral-900 dark:hover:border-neutral-400 dark:hover:text-neutral-200"
            }`}
          >
            全部
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={buildHref("category", cat.slug)}
              className={`text-xs px-2.5 py-1 border transition-colors ${
                activeCategory === cat.slug
                  ? "bg-neutral-900 text-white border-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 dark:border-neutral-100"
                  : "text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 hover:text-neutral-900 dark:hover:border-neutral-400 dark:hover:text-neutral-200"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* 標籤 */}
      {tags.length > 0 && (
        <div>
          <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 mr-3 uppercase tracking-wider">標籤</span>
          <div className="inline-flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Link
                key={tag.slug}
                href={buildHref("tag", tag.slug)}
                className={`text-xs px-2.5 py-1 border transition-colors ${
                  activeTag === tag.slug
                    ? "bg-neutral-900 text-white border-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 dark:border-neutral-100"
                    : "text-neutral-400 dark:text-neutral-500 border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 hover:text-neutral-900 dark:hover:border-neutral-400 dark:hover:text-neutral-200"
                }`}
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {(activeCategory || activeTag) && (
        <div className="pt-1">
          <Link
            href={buildHref("category", null)}
            className="text-xs text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
          >
            ✕ 清除篩選
          </Link>
        </div>
      )}
    </div>
  );
}
