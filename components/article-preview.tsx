"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ArticlePreviewProps = {
  title: string;
  excerpt: string;
  content: string;
  categoryName: string;
  coverImage: string;
  onClose: () => void;
};

/**
 * 文章預覽 — 在編輯頁面內模擬前台排版
 */
export default function ArticlePreview({
  title, excerpt, content, categoryName, coverImage, onClose,
}: ArticlePreviewProps) {
  const date = new Date().toLocaleDateString("zh-TW", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-neutral-950 overflow-y-auto">
      {/* 頂部工具列 */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[10px] bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-2 py-0.5 uppercase tracking-wider font-medium font-display">
            預覽模式
          </span>
          <span className="text-xs text-neutral-400 dark:text-neutral-600">
            此為模擬前台顯示效果
          </span>
        </div>
        <button
          onClick={onClose}
          className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-medium px-4 py-2 hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors uppercase tracking-wider"
        >
          返回編輯
        </button>
      </div>

      {/* 模擬文章頁 */}
      <article className="max-w-[680px] mx-auto px-4 py-10">
        {/* Meta */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-medium text-neutral-900 dark:text-neutral-100 uppercase tracking-widest font-display">
            {categoryName || "未分類"}
          </span>
          <span className="w-4 border-t border-neutral-300 dark:border-neutral-700" />
          <time className="text-[10px] text-neutral-400 dark:text-neutral-600">{date}</time>
        </div>

        {/* 標題 */}
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 leading-snug tracking-wide mb-4">
          {title || "（尚未填寫標題）"}
        </h1>

        {/* 摘要 */}
        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-8">
          {excerpt || "（尚未填寫摘要）"}
        </p>

        {/* 封面圖 */}
        {coverImage && (
          <div className="w-[calc(100%+80px)] -ml-10 mb-8">
            <img src={coverImage} alt={title} className="w-full object-cover" />
          </div>
        )}

        {/* 內容 */}
        <div className="prose text-neutral-800 dark:text-neutral-300">
          {content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          ) : (
            <p className="text-neutral-400 italic">（尚未填寫內容）</p>
          )}
        </div>
      </article>
    </div>
  );
}
