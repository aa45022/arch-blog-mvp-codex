"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Markdown 編輯器 — textarea + 即時預覽
 */
type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div>
      {/* 切換列 */}
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => setShowPreview(false)}
          className={`text-xs px-3 py-1 rounded ${
            !showPreview
              ? "bg-accent text-white"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          編輯
        </button>
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className={`text-xs px-3 py-1 rounded ${
            showPreview
              ? "bg-accent text-white"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          預覽
        </button>
      </div>

      {/* 編輯 / 預覽 */}
      {showPreview ? (
        <div className="prose border border-gray-200 rounded-lg p-4 min-h-[300px] text-sm">
          {value ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          ) : (
            <p className="text-gray-400">尚無內容</p>
          )}
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="使用 Markdown 格式撰寫文章內容..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent transition-colors min-h-[300px] resize-y font-mono leading-relaxed"
        />
      )}
    </div>
  );
}
