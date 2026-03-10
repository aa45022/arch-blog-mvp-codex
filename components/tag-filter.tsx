"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

/**
 * 分類 + 標籤篩選
 * Client Component（需要讀取 URL search params 來標示 active 狀態）
 */
type TagFilterProps = {
  categories: { name: string; slug: string }[];
  tags: { name: string; slug: string }[];
};

export default function TagFilter({ categories, tags }: TagFilterProps) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");
  const activeTag = searchParams.get("tag");

  /**
   * 組合 URL params — 保留搜尋條件，切換篩選
   */
  function buildHref(key: string, value: string | null): string {
    const params = new URLSearchParams(searchParams.toString());

    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    // 切換分類時清除標籤，反之亦然
    if (key === "category") params.delete("tag");
    if (key === "tag") params.delete("category");

    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  }

  return (
    <div className="space-y-3">
      {/* 分類 */}
      <div>
        <span className="text-xs font-medium text-gray-500 mr-2">分類</span>
        <div className="inline-flex flex-wrap gap-1.5">
          <Link
            href={buildHref("category", null)}
            className={`text-xs px-2.5 py-1 rounded border transition-colors ${
              !activeCategory && !activeTag
                ? "bg-accent text-white border-accent"
                : "text-gray-500 border-gray-200 hover:border-accent hover:text-accent"
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
                  : "text-gray-500 border-gray-200 hover:border-accent hover:text-accent"
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
          <span className="text-xs font-medium text-gray-500 mr-2">標籤</span>
          <div className="inline-flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Link
                key={tag.slug}
                href={buildHref("tag", tag.slug)}
                className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                  activeTag === tag.slug
                    ? "bg-accent text-white border-accent"
                    : "text-gray-400 border-gray-200 hover:border-accent hover:text-accent"
                }`}
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Active filter badge — 有篩選時顯示清除按鈕 */}
      {(activeCategory || activeTag) && (
        <div className="pt-1">
          <Link
            href={buildHref("category", null)}
            className="text-xs text-red-500 hover:text-red-700"
          >
            ✕ 清除篩選
          </Link>
        </div>
      )}
    </div>
  );
}
