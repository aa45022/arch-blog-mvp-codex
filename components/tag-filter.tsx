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
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mr-2">分類</span>
        <div className="inline-flex flex-wrap gap-1.5">
          <Link
            href={buildHref("category", null)}
            className={`text-xs px-2.5 py-1 rounded border transition-colors ${
              !activeCategory && !activeTag
                ? "bg-accent text-white border-accent"
                : "text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-accent hover:text-accent"
            }`}
          >
            全部
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={buildHref("category", cat.slug)}
              className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                activeCategory === cat.slug
                  ? "bg-accent text-white border-accent"
                  : "text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-accent hover:text-accent"
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
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mr-2">標籤</span>
          <div className="inline-flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Link
                key={tag.slug}
                href={buildHref("tag", tag.slug)}
                className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                  activeTag === tag.slug
                    ? "bg-accent text-white border-accent"
                    : "text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700 hover:border-accent hover:text-accent"
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
            className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            ✕ 清除篩選
          </Link>
        </div>
      )}
    </div>
  );
}
