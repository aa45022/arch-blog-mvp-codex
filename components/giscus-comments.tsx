"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Giscus 留言系統
 * 使用 GitHub Discussions 驅動
 *
 * 設定步驟：
 * 1. 到 GitHub repo → Settings → Features → 勾選 Discussions
 * 2. 到 https://giscus.app 設定並取得 data-repo-id 和 data-category-id
 * 3. 更新下方的 REPO、REPO_ID、CATEGORY、CATEGORY_ID
 */

const REPO = "aa45022/arch-blog-mvp";
const REPO_ID = ""; // 從 giscus.app 取得
const CATEGORY = "Announcements";
const CATEGORY_ID = ""; // 從 giscus.app 取得

export default function GiscusComments() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  // 監聽 dark mode 變化
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    function checkTheme() {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "noborder_dark" : "noborder_light");
    }
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // 如果尚未設定 repo ID，顯示提示
    if (!REPO_ID || !CATEGORY_ID) {
      setLoaded(true);
      return;
    }

    // 清除舊的
    const container = containerRef.current;
    container.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", REPO);
    script.setAttribute("data-repo-id", REPO_ID);
    script.setAttribute("data-category", CATEGORY);
    script.setAttribute("data-category-id", CATEGORY_ID);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", theme);
    script.setAttribute("data-lang", "zh-TW");
    script.setAttribute("data-loading", "lazy");
    script.crossOrigin = "anonymous";
    script.async = true;

    container.appendChild(script);
    setLoaded(true);
  }, [theme]);

  // 當 theme 變化時更新 iframe
  useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
    if (iframe) {
      iframe.contentWindow?.postMessage(
        { giscus: { setConfig: { theme } } },
        "https://giscus.app"
      );
    }
  }, [theme]);

  if (!REPO_ID || !CATEGORY_ID) {
    return (
      <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
        <p className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.2em] mb-4 font-display">
          Comments
        </p>
        <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 text-center">
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">留言系統尚未啟用</p>
          <p className="text-xs text-neutral-400 dark:text-neutral-600 leading-relaxed">
            請到 GitHub repo 啟用 Discussions，然後到{" "}
            <a href="https://giscus.app" target="_blank" rel="noopener noreferrer" className="underline hover:text-neutral-900 dark:hover:text-neutral-200">
              giscus.app
            </a>{" "}
            取得設定值，填入 <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1">components/giscus-comments.tsx</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
      <p className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.2em] mb-4 font-display">
        Comments
      </p>
      <div ref={containerRef} className={loaded ? "" : "min-h-[200px]"} />
    </div>
  );
}
