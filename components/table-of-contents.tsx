"use client";

import { useEffect, useState } from "react";
import { List, X } from "lucide-react";

type TocItem = { id: string; text: string; level: number };

/**
 * 文章目錄 — 從 DOM 中抓取 h2/h3 生成目錄
 * 可收合，高亮當前段落
 */
export default function TableOfContents() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // 抓取 .prose 內的 h2, h3
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

  // 監聽滾動，高亮當前段落
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
        className="fixed bottom-6 right-18 z-40 w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-accent hover:border-accent transition-all lg:hidden"
        aria-label="目錄"
      >
        {open ? <X className="w-4 h-4" /> : <List className="w-4 h-4" />}
      </button>

      {/* 目錄面板 */}
      <nav
        className={`fixed z-30 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg p-4 max-h-[60vh] overflow-y-auto transition-all duration-300
          ${open ? "bottom-20 right-6 opacity-100" : "bottom-20 right-6 opacity-0 pointer-events-none"}
          lg:sticky lg:top-24 lg:bottom-auto lg:right-auto lg:opacity-100 lg:pointer-events-auto lg:shadow-none lg:border-0 lg:bg-transparent lg:dark:bg-transparent lg:p-0`}
      >
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
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
                    ? "text-accent font-medium"
                    : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
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
