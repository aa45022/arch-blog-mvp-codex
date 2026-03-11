"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React, { useState, useEffect, useCallback } from "react";
import { Check, Copy, Link as LinkIcon } from "lucide-react";

/**
 * 程式碼區塊 — 語法高亮 + 複製按鈕
 */
function CodeBlock({ children, className }: { children: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  // 從 className 取得語言（例如 "language-js"）
  const lang = className?.replace("language-", "") || "";

  async function handleCopy() {
    await navigator.clipboard.writeText(children.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Prism 語法高亮
  useEffect(() => {
    if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>).Prism) {
      ((window as unknown as Record<string, unknown>).Prism as { highlightAll: () => void }).highlightAll();
    }
  }, [children]);

  return (
    <div className="relative group">
      {/* 語言標籤 */}
      {lang && (
        <div className="absolute top-0 left-0 text-[10px] text-neutral-500 bg-neutral-800 px-2 py-0.5 uppercase tracking-wider font-mono">
          {lang}
        </div>
      )}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded bg-neutral-700 hover:bg-neutral-600 text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="複製程式碼"
      >
        {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
      </button>
      <pre className={`${className || ""} !mt-0`}>
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

/**
 * 標題元件 — 帶錨點連結
 * hover 時顯示 # 可點擊複製 URL
 */
function HeadingWithAnchor({
  level,
  children,
  id,
}: {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  id?: string;
}) {
  const [copied, setCopied] = useState(false);
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;

  // 從 children 生成 id
  const text = typeof children === "string" ? children : "";
  const headingId = id || text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "") || undefined;

  const handleCopyLink = useCallback(() => {
    if (!headingId) return;
    const url = `${window.location.origin}${window.location.pathname}#${headingId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [headingId]);

  return (
    <Tag id={headingId} className="group relative scroll-mt-24">
      {children}
      {headingId && (
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-neutral-300 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-neutral-200"
          aria-label="複製段落連結"
          title={copied ? "已複製！" : "複製連結"}
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-green-500" />
          ) : (
            <LinkIcon className="w-3.5 h-3.5" />
          )}
        </button>
      )}
    </Tag>
  );
}

/**
 * Markdown 渲染元件
 * - react-markdown + remark-gfm
 * - Prism.js 語法高亮（CDN）
 * - 標題錨點連結
 * - 程式碼區塊複製按鈕
 * - 圖片 cursor-zoom-in（配合 ImageLightbox）
 */
export default function MarkdownContent({ content }: { content: string }) {
  // 載入 Prism.js
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as unknown as Record<string, unknown>).Prism) return;

    // CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css";
    document.head.appendChild(link);

    // JS
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js";
    script.async = true;
    script.onload = () => {
      // 載入常用語言包
      const langs = ["javascript", "typescript", "css", "python", "bash", "json", "markdown", "jsx", "tsx"];
      langs.forEach((lang) => {
        const s = document.createElement("script");
        s.src = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-${lang}.min.js`;
        s.async = true;
        document.head.appendChild(s);
      });

      // 延遲執行高亮
      setTimeout(() => {
        ((window as unknown as Record<string, unknown>).Prism as { highlightAll: () => void })?.highlightAll();
      }, 300);
    };
    document.head.appendChild(script);
  }, []);

  // 內容變更時重新高亮
  useEffect(() => {
    const timer = setTimeout(() => {
      if ((window as unknown as Record<string, unknown>).Prism) {
        ((window as unknown as Record<string, unknown>).Prism as { highlightAll: () => void }).highlightAll();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [content]);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // 標題 — 帶錨點連結
        h1({ children }) { return <HeadingWithAnchor level={1}>{children}</HeadingWithAnchor>; },
        h2({ children }) { return <HeadingWithAnchor level={2}>{children}</HeadingWithAnchor>; },
        h3({ children }) { return <HeadingWithAnchor level={3}>{children}</HeadingWithAnchor>; },
        h4({ children }) { return <HeadingWithAnchor level={4}>{children}</HeadingWithAnchor>; },

        // 程式碼區塊覆寫
        pre({ children }) {
          const codeElement = children as React.ReactElement<{ children: string; className?: string }>;
          if (codeElement?.props?.children) {
            return (
              <CodeBlock className={codeElement.props.className}>
                {String(codeElement.props.children)}
              </CodeBlock>
            );
          }
          return <pre>{children}</pre>;
        },

        // 圖片加上放大提示
        img({ src, alt }) {
          return (
            <img
              src={src}
              alt={alt || ""}
              className="cursor-zoom-in hover:opacity-90 transition-opacity"
            />
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
