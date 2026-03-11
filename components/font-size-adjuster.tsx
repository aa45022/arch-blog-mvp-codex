"use client";

import { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";

const SIZES = [
  { label: "小", value: "text-sm", base: 14 },
  { label: "中", value: "text-base", base: 16 },
  { label: "大", value: "text-lg", base: 18 },
];

/**
 * 字體大小調整 — 切換文章內容的字級
 */
export default function FontSizeAdjuster() {
  const [sizeIndex, setSizeIndex] = useState(1); // 預設中

  useEffect(() => {
    const saved = localStorage.getItem("fontSize");
    if (saved) {
      const idx = SIZES.findIndex((s) => s.label === saved);
      if (idx >= 0) setSizeIndex(idx);
    }
  }, []);

  useEffect(() => {
    const prose = document.querySelector(".prose");
    if (!prose) return;

    // 移除所有字級 class
    SIZES.forEach((s) => prose.classList.remove(s.value));
    // 加上當前字級
    prose.classList.add(SIZES[sizeIndex].value);
    localStorage.setItem("fontSize", SIZES[sizeIndex].label);
  }, [sizeIndex]);

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => setSizeIndex(Math.max(0, sizeIndex - 1))}
        disabled={sizeIndex === 0}
        aria-label="縮小字體"
        className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:text-accent hover:border-accent transition-colors disabled:opacity-30"
      >
        <Minus className="w-3 h-3" />
      </button>
      <span className="text-[10px] text-gray-400 dark:text-gray-500 w-4 text-center">
        {SIZES[sizeIndex].label}
      </span>
      <button
        onClick={() => setSizeIndex(Math.min(SIZES.length - 1, sizeIndex + 1))}
        disabled={sizeIndex === SIZES.length - 1}
        aria-label="放大字體"
        className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:text-accent hover:border-accent transition-colors disabled:opacity-30"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
}
