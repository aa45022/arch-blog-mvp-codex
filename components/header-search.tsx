"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

export default function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // 開啟時自動 focus
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Ctrl+K / Cmd+K 快捷鍵
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
    setQuery("");
  }

  return (
    <>
      {/* 搜尋觸發按鈕 */}
      <button
        onClick={() => setOpen(true)}
        title="搜尋 (Ctrl+K)"
        className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
      >
        <Search className="w-3.5 h-3.5" />
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
          {/* 背景遮罩 */}
          <div
            className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* 搜尋框 */}
          <div className="relative w-full max-w-lg mx-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl">
            <form onSubmit={handleSubmit} className="flex items-center">
              <Search className="w-4 h-4 text-neutral-400 ml-4 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜尋文章..."
                className="flex-1 bg-transparent text-neutral-900 dark:text-neutral-100 text-sm px-3 py-4 outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 mr-2"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <div className="border-l border-neutral-200 dark:border-neutral-800 px-3 py-2 mr-1">
                <kbd className="text-[10px] text-neutral-400 dark:text-neutral-600 font-mono">ESC</kbd>
              </div>
            </form>
            <div className="border-t border-neutral-100 dark:border-neutral-800 px-4 py-2">
              <p className="text-[10px] text-neutral-400 dark:text-neutral-600">
                按 Enter 搜尋 · <kbd className="font-mono">Ctrl+K</kbd> 開啟搜尋
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
