"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered,
  Link as LinkIcon, Code, Quote, ImageIcon, Minus,
  Table, Maximize2, Minimize2, Upload
} from "lucide-react";

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
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
    .replace(/`([^`]+)`/g, '<code class="bg-neutral-100 text-red-500 text-xs px-1 rounded">$1</code>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-neutral-300 pl-3 text-neutral-500 italic">$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal">$2</li>')
    .replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" class="max-w-full my-2 rounded" />')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-neutral-900 underline" target="_blank">$1</a>')
    .replace(/\n\n/g, '</p><p class="mb-3">')
    .replace(/^/, '<p class="mb-3">')
    .replace(/$/, '</p>');
}

/** 計算字數（中文字元 + 英文單字） */
function countWords(text: string): { chars: number; chinese: number; english: number } {
  const chinese = (text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
  const english = (text.match(/[a-zA-Z]+/g) || []).length;
  const chars = text.replace(/\s/g, "").length;
  return { chars, chinese, english };
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const wordCount = countWords(value);

  // ESC 離開全螢幕
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isFullscreen]);

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

  // 插入表格
  const insertTable = useCallback(() => {
    const table = `\n| 欄位 1 | 欄位 2 | 欄位 3 |\n| --- | --- | --- |\n| 內容 | 內容 | 內容 |\n`;
    insertMarkdown(table, "");
  }, [insertMarkdown]);

  // 上傳圖片到 Cloudinary
  const uploadImage = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("圖片大小不能超過 5MB");
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "上傳失敗");
        return;
      }

      // 在游標位置插入圖片 Markdown
      const ta = textareaRef.current;
      const pos = ta ? ta.selectionStart : value.length;
      const before = value.slice(0, pos);
      const after = value.slice(pos);
      const imgMd = `\n![${file.name}](${data.url})\n`;
      onChange(before + imgMd + after);
    } catch {
      alert("上傳時發生錯誤");
    } finally {
      setUploading(false);
    }
  }, [value, onChange]);

  // 工具列按鈕上傳
  const handleToolbarUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadImage(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [uploadImage]);

  // 拖拽上傳
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      uploadImage(file);
    }
  }, [uploadImage]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // 貼上圖片
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) uploadImage(file);
        return;
      }
    }
  }, [uploadImage]);

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
    { icon: ImageIcon, label: "圖片 URL", action: () => insertMarkdown("![", "](https://)", "圖片說明") },
    { icon: Upload, label: "上傳圖片", action: handleToolbarUpload },
    { icon: Table, label: "插入表格", action: insertTable },
    { icon: Minus, label: "分隔線", action: () => insertMarkdown("\n---\n", "") },
  ];

  const fullscreenClasses = isFullscreen
    ? "fixed inset-0 z-50 bg-white dark:bg-neutral-950 flex flex-col"
    : "border border-neutral-200 dark:border-neutral-800";

  return (
    <div ref={containerRef} className={`${fullscreenClasses} overflow-hidden`}>
      {/* 隱藏的 file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Tab + Toolbar */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 shrink-0">
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

          {/* 全螢幕切換 */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "離開全螢幕 (ESC)" : "全螢幕編輯"}
            className="w-7 h-7 flex items-center justify-center text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors mr-1"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

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

      {/* 上傳中提示 */}
      {uploading && (
        <div className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 text-xs text-neutral-500 dark:text-neutral-400 animate-pulse shrink-0">
          ⏳ 圖片上傳中...
        </div>
      )}

      {tab === "write" ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onPaste={handlePaste}
          placeholder={`## 段落標題\n\n內文段落...\n\n- 清單項目\n\n**粗體** *斜體* \`程式碼\`\n\n💡 可直接拖拽或貼上圖片`}
          rows={isFullscreen ? undefined : 16}
          className={`w-full px-4 py-3 text-sm font-mono text-neutral-800 dark:text-neutral-200 outline-none resize-y bg-white dark:bg-neutral-950 leading-relaxed ${
            isFullscreen ? "flex-1 resize-none" : ""
          }`}
        />
      ) : (
        <div
          className={`px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed bg-white dark:bg-neutral-950 prose max-w-none overflow-auto ${
            isFullscreen ? "flex-1" : "min-h-[200px]"
          }`}
          dangerouslySetInnerHTML={{
            __html: value
              ? renderMarkdown(value)
              : '<p class="text-neutral-400 italic">尚無內容...</p>',
          }}
        />
      )}

      {/* 底部狀態列 — 字數統計 */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-4 py-1.5 flex items-center justify-between text-[10px] text-neutral-400 dark:text-neutral-600 shrink-0">
        <div className="flex items-center gap-4">
          <span>{wordCount.chars} 字元</span>
          <span>{wordCount.chinese} 中文字</span>
          <span>{wordCount.english} 英文詞</span>
          <span>約 {Math.max(1, Math.ceil(wordCount.chinese / 400 + wordCount.english / 200))} 分鐘閱讀</span>
        </div>
        <div className="flex items-center gap-3">
          <span>💡 拖拽/貼上圖片可直接上傳</span>
          {isFullscreen && <span>按 ESC 離開全螢幕</span>}
        </div>
      </div>
    </div>
  );
}
