"use client";

import { useEffect, useState } from "react";
import { List, X } from "lucide-react";

type TocItem = { id: string; text: string; level: number };

/**
 * 文章目錄
 * 桌面版：完整展開，sticky 側邊
 * 手機版：浮動按鈕 + 收合面板
 */
export default function TableOfContents() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const headings = document.querySelectorAll(".prose h2, .prose h3");
    const tocItems: TocItem[] = [];

    headings.forEach((el, i) => {
      const id = el.id || `heading-${i}`;
      if (!el.id) el.id = id;
      tocItems.push({
        id,
        text: el.textContent || "",
        level: el.tagName === "H2" ? 2 : 3,
      });
    });

    setItems(tocItems);
  }, []);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <>
      {/* 浮動按鈕（手機用） */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-18 z-40 w-10 h-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-lg flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:border-neutral-900 dark:hover:border-neutral-400 transition-all lg:hidden"
        aria-label="目錄"
      >
        {open ? <X className="w-4 h-4" /> : <List className="w-4 h-4" />}
      </button>

      {/* 手機版：收合面板 */}
      <nav
        className={`fixed z-30 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-lg p-4 max-h-[60vh] overflow-y-auto transition-all duration-300 lg:hidden
          ${open ? "bottom-20 right-6 opacity-100" : "bottom-20 right-6 opacity-0 pointer-events-none"}`}
      >
        <p className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 mb-2 uppercase tracking-[0.2em] font-display">
          目錄
        </p>
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                className={`block text-xs py-1 transition-colors ${
                  item.level === 3 ? "pl-4" : ""
                } ${
                  activeId === item.id
                    ? "text-neutral-900 dark:text-neutral-100 font-medium"
                    : "text-neutral-400 dark:text-neutral-600 hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* 桌面版：完整展開，不限高度 */}
      <nav className="hidden lg:block sticky top-24">
        <p className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 mb-3 uppercase tracking-[0.2em] font-display">
          目錄
        </p>
        <ul className="space-y-1 border-l border-neutral-200 dark:border-neutral-800">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`block text-xs py-1.5 transition-colors border-l-2 -ml-px ${
                  item.level === 3 ? "pl-6" : "pl-3"
                } ${
                  activeId === item.id
                    ? "text-neutral-900 dark:text-neutral-100 font-medium border-neutral-900 dark:border-neutral-100"
                    : "text-neutral-400 dark:text-neutral-600 hover:text-neutral-700 dark:hover:text-neutral-300 border-transparent"
                }`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
