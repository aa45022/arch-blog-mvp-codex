"use client";

import { useState } from "react";

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
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-neutral-900 dark:text-neutral-100 underline" target="_blank">$1</a>')
    .replace(/\n\n/g, '</p><p class="mb-3">')
    .replace(/^/, '<p class="mb-3">')
    .replace(/$/, '</p>');
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [tab, setTab] = useState<"write" | "preview">("write");

  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden">
      {/* Tab 切換 */}
      <div className="flex border-b border-neutral-200 bg-neutral-50">
        <button
          type="button"
          onClick={() => setTab("write")}
          className={`text-xs px-4 py-2 transition-colors ${
            tab === "write"
              ? "bg-white text-neutral-900 border-b-2 border-neutral-900 dark:border-neutral-100 font-medium"
              : "text-neutral-400 hover:text-neutral-600"
          }`}
        >
          ✏️ 編輯
        </button>
        <button
          type="button"
          onClick={() => setTab("preview")}
          className={`text-xs px-4 py-2 transition-colors ${
            tab === "preview"
              ? "bg-white text-neutral-900 border-b-2 border-neutral-900 dark:border-neutral-100 font-medium"
              : "text-neutral-400 hover:text-neutral-600"
          }`}
        >
          👁 預覽
        </button>
        <div className="flex-1" />
        <span className="text-[10px] text-neutral-300 px-3 py-2 self-center">
          支援 Markdown 語法
        </span>
      </div>

      {tab === "write" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`## 段落標題\n\n內文段落...\n\n- 清單項目\n\n**粗體** *斜體* \`程式碼\``}
          rows={16}
          className="w-full px-4 py-3 text-sm font-mono text-neutral-800 outline-none resize-y bg-white leading-relaxed"
        />
      ) : (
        <div
          className="min-h-[200px] px-4 py-3 text-sm text-neutral-700 leading-relaxed bg-white prose max-w-none"
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
