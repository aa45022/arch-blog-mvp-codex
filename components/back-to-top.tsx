"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * 返回頂部按鈕
 */
export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setShow(window.scrollY > 300);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="返回頂部"
      className="fixed bottom-6 right-6 z-40 w-10 h-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-lg flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:border-neutral-900 dark:hover:border-neutral-400 transition-all"
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
}
