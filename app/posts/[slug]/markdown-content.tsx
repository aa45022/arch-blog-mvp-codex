"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { Check, Copy } from "lucide-react";

/**
 * 程式碼區塊 — 附帶一鍵複製按鈕
 */
function CodeBlock({ children, className }: { children: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(children.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-gray-600 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="複製程式碼"
      >
        {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
      </button>
      <pre className={className}>
        <code>{children}</code>
      </pre>
    </div>
  );
}

/**
 * Markdown 渲染元件
 * - react-markdown + remark-gfm
 * - 程式碼區塊附帶複製按鈕
 * - 圖片加上 cursor-zoom-in（配合 ImageLightbox）
 */
export default function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // 程式碼區塊覆寫
        pre({ children }) {
          // 從 pre > code 中提取文字
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
