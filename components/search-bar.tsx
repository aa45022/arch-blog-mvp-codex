"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

/**
 * 搜尋列 — 搜尋 title + excerpt
 * Client Component，透過 URL search params 傳遞搜尋條件
 */
export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }

    // 搜尋時清除分頁（未來擴充用）
    params.delete("page");

    router.push(`/?${params.toString()}`);
  }

  function handleClear() {
    setQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    router.push(`/?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜尋文章..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
          >
            ✕
          </button>
        )}
      </div>
      <button
        type="submit"
        className="bg-accent text-white text-sm px-4 py-2 rounded-lg hover:bg-accent-dark transition-colors"
      >
        搜尋
      </button>
    </form>
  );
}
