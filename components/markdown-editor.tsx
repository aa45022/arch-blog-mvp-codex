"use client";

import { useState, useRef, useCallback } from "react";
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Link as LinkIcon, Code, Quote, ImageIcon, Minus } from "lucide-react";

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold mt-4 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold mt-5 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold mt-6 mb-2">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-neutral-100 text-red-500 text-xs px-1 rounded">$1</code>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-neutral-300 pl-3 text-neutral-500 italic">$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal">$2</li>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-neutral-900 underline" target="_blank">$1</a>')
    .replace(/\n\n/g, '</p><p class="mb-3">')
    .replace(/^/, '<p class="mb-3">')
    .replace(/$/, '</p>');
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [tab, setTab] = useState<"write" | "preview">("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 在游標位置插入文字或包裹選取文字
  const insertMarkdown = useCallback((prefix: string, suffix: string = "", placeholder: string = "") => {
    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end);
    const text = selected || placeholder;

    const before = value.slice(0, start);
    const after = value.slice(end);
    const newValue = before + prefix + text + suffix + after;

    onChange(newValue);

    // 恢復游標位置
    requestAnimationFrame(() => {
      ta.focus();
      const cursorPos = start + prefix.length + (selected ? selected.length : 0) + suffix.length;
      ta.setSelectionRange(
        selected ? cursorPos : start + prefix.length,
        selected ? cursorPos : start + prefix.length + text.length
      );
    });
  }, [value, onChange]);

  // 在行首插入
  const insertLinePrefix = useCallback((prefix: string) => {
    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const before = value.slice(0, lineStart);
    const after = value.slice(lineStart);
    const newValue = before + prefix + after;

    onChange(newValue);

    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, start + prefix.length);
    });
  }, [value, onChange]);

  // 快捷鍵
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "b":
          e.preventDefault();
          insertMarkdown("**", "**", "粗體文字");
          break;
        case "i":
          e.preventDefault();
          insertMarkdown("*", "*", "斜體文字");
          break;
        case "k":
          e.preventDefault();
          insertMarkdown("[", "](https://)", "連結文字");
          break;
      }
    }
  }, [insertMarkdown]);

  const toolbarButtons = [
    { icon: Bold, label: "粗體 (Ctrl+B)", action: () => insertMarkdown("**", "**", "粗體文字") },
    { icon: Italic, label: "斜體 (Ctrl+I)", action: () => insertMarkdown("*", "*", "斜體文字") },
    { icon: null, label: "sep1" },
    { icon: Heading2, label: "H2 標題", action: () => insertLinePrefix("## ") },
    { icon: Heading3, label: "H3 標題", action: () => insertLinePrefix("### ") },
    { icon: null, label: "sep2" },
    { icon: List, label: "無序列表", action: () => insertLinePrefix("- ") },
    { icon: ListOrdered, label: "有序列表", action: () => insertLinePrefix("1. ") },
    { icon: Quote, label: "引用", action: () => insertLinePrefix("> ") },
    { icon: null, label: "sep3" },
    { icon: Code, label: "行內程式碼", action: () => insertMarkdown("`", "`", "code") },
    { icon: LinkIcon, label: "連結 (Ctrl+K)", action: () => insertMarkdown("[", "](https://)", "連結文字") },
    { icon: ImageIcon, label: "圖片", action: () => insertMarkdown("![", "](https://)", "圖片說明") },
    { icon: Minus, label: "分隔線", action: () => insertMarkdown("\n---\n", "") },
  ];

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      {/* Tab + Toolbar */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setTab("write")}
            className={`text-xs px-4 py-2 transition-colors ${
              tab === "write"
                ? "bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 border-b-2 border-neutral-900 dark:border-neutral-100 font-medium"
                : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            }`}
          >
            ✏️ 編輯
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`text-xs px-4 py-2 transition-colors ${
              tab === "preview"
                ? "bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 border-b-2 border-neutral-900 dark:border-neutral-100 font-medium"
                : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            }`}
          >
            👁 預覽
          </button>
          <div className="flex-1" />
          <span className="text-[10px] text-neutral-300 dark:text-neutral-600 px-3 py-2 self-center">
            支援 Markdown
          </span>
        </div>

        {/* Toolbar — 只在編輯模式顯示 */}
        {tab === "write" && (
          <div className="flex items-center gap-0.5 px-2 py-1.5 border-t border-neutral-200 dark:border-neutral-800 overflow-x-auto">
            {toolbarButtons.map((btn, i) => {
              if (!btn.icon) {
                return <div key={btn.label} className="w-px h-5 bg-neutral-200 dark:bg-neutral-700 mx-1" />;
              }
              const Icon = btn.icon;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={btn.action}
                  title={btn.label}
                  className="w-7 h-7 flex items-center justify-center text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {tab === "write" ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`## 段落標題\n\n內文段落...\n\n- 清單項目\n\n**粗體** *斜體* \`程式碼\``}
          rows={16}
          className="w-full px-4 py-3 text-sm font-mono text-neutral-800 dark:text-neutral-200 outline-none resize-y bg-white dark:bg-neutral-950 leading-relaxed"
        />
      ) : (
        <div
          className="min-h-[200px] px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed bg-white dark:bg-neutral-950 prose max-w-none"
          dangerouslySetInnerHTML={{
            __html: value
              ? renderMarkdown(value)
              : '<p class="text-neutral-400 italic">尚無內容...</p>',
          }}
        />
      )}
    </div>
  );
}
