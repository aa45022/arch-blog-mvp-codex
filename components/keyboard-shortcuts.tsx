"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Keyboard, X } from "lucide-react";

/**
 * 全站快捷鍵系統
 * /     — 開啟搜尋
 * t     — 回到頂部
 * j     — 下一篇文章（文章頁）
 * k     — 上一篇文章（文章頁）
 * ?     — 顯示快捷鍵說明
 * ESC   — 關閉說明
 */
export default function KeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // 不在 input/textarea/contenteditable 中觸發
      const tag = (e.target as HTMLElement).tagName;
      const isEditing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" ||
        (e.target as HTMLElement).isContentEditable;

      if (isEditing) return;

      // Ctrl/Cmd 組合鍵不攔截（讓 Ctrl+K 搜尋等正常運作）
      if (e.ctrlKey || e.metaKey) return;

      switch (e.key) {
        case "/":
          e.preventDefault();
          // 觸發 HeaderSearch 的 Ctrl+K
          window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
          break;

        case "t":
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          break;

        case "j": {
          // 下一篇：尋找 post-navigation 的下一篇連結
          const nextLink = document.querySelector("[data-nav-next]") as HTMLAnchorElement;
          if (nextLink?.href) router.push(nextLink.href);
          break;
        }

        case "k": {
          // 上一篇
          const prevLink = document.querySelector("[data-nav-prev]") as HTMLAnchorElement;
          if (prevLink?.href) router.push(prevLink.href);
          break;
        }

        case "?":
          e.preventDefault();
          setShowHelp(true);
          break;

        case "Escape":
          setShowHelp(false);
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, pathname]);

  const shortcuts = [
    { key: "/", desc: "開啟搜尋" },
    { key: "t", desc: "回到頂部" },
    { key: "j", desc: "下一篇文章" },
    { key: "k", desc: "上一篇文章" },
    { key: "?", desc: "顯示快捷鍵說明" },
    { key: "ESC", desc: "關閉面板" },
  ];

  return (
    <>
      {/* 快捷鍵提示按鈕（右下角，在 back-to-top 上方） */}
      <button
        onClick={() => setShowHelp(!showHelp)}
        className="fixed bottom-6 left-6 z-40 w-8 h-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-neutral-200 hover:border-neutral-900 dark:hover:border-neutral-400 transition-all opacity-40 hover:opacity-100"
        data-print-hide
        title="快捷鍵 (?)"
      >
        <Keyboard className="w-3.5 h-3.5" />
      </button>

      {/* 快捷鍵說明面板 */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" data-print-hide>
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" onClick={() => setShowHelp(false)} />
          <div className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl w-full max-w-sm mx-4">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 font-serif">快捷鍵</h3>
              <button onClick={() => setShowHelp(false)} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 py-4 space-y-3">
              {shortcuts.map((s) => (
                <div key={s.key} className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">{s.desc}</span>
                  <kbd className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-2 py-0.5 border border-neutral-200 dark:border-neutral-700">
                    {s.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
