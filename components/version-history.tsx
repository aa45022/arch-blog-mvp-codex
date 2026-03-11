"use client";

import { useState, useEffect } from "react";
import { History, RotateCcw, ChevronDown, ChevronUp, Eye } from "lucide-react";

type Version = {
  id: number;
  title: string;
  excerpt: string;
  note: string | null;
  createdAt: string;
};

type VersionDetail = {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  createdAt: string;
};

type VersionHistoryProps = {
  postId: number;
  onRestore: (version: VersionDetail) => void;
};

export default function VersionHistory({ postId, onRestore }: VersionHistoryProps) {
  const [open, setOpen] = useState(false);
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewId, setPreviewId] = useState<number | null>(null);
  const [previewContent, setPreviewContent] = useState<string>("");
  const [loadingPreview, setLoadingPreview] = useState(false);

  async function loadVersions() {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/versions`);
      const data = await res.json();
      if (data.data) setVersions(data.data);
    } catch {
      // ignore
    }
    setLoading(false);
  }

  useEffect(() => {
    if (open && versions.length === 0) {
      loadVersions();
    }
  }, [open]);

  async function handlePreview(versionId: number) {
    if (previewId === versionId) {
      setPreviewId(null);
      setPreviewContent("");
      return;
    }

    setLoadingPreview(true);
    setPreviewId(versionId);
    try {
      const res = await fetch(`/api/posts/${postId}/versions/${versionId}`);
      const data = await res.json();
      if (data.data) {
        setPreviewContent(data.data.content);
      }
    } catch {
      setPreviewContent("載入失敗");
    }
    setLoadingPreview(false);
  }

  async function handleRestore(versionId: number) {
    if (!confirm("確定要還原到此版本嗎？目前的內容會先被保存為新版本。")) return;

    try {
      const res = await fetch(`/api/posts/${postId}/versions/${versionId}`);
      const data = await res.json();
      if (data.data) {
        onRestore(data.data);
      }
    } catch {
      alert("還原失敗");
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
      {/* 標題列 */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
      >
        <div className="flex items-center gap-2">
          <History className="w-3.5 h-3.5" />
          <span>版本歷史</span>
          {versions.length > 0 && (
            <span className="text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-400 px-1.5 py-0.5">
              {versions.length}
            </span>
          )}
        </div>
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {/* 版本列表 */}
      {open && (
        <div className="border-t border-neutral-200 dark:border-neutral-800">
          {loading ? (
            <div className="px-4 py-6 text-center">
              <p className="text-xs text-neutral-400">載入中...</p>
            </div>
          ) : versions.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-xs text-neutral-400">尚無版本紀錄</p>
              <p className="text-[10px] text-neutral-300 dark:text-neutral-600 mt-1">
                每次更新文章時會自動保存舊版本
              </p>
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800">
              {versions.map((v) => (
                <div key={v.id} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-neutral-700 dark:text-neutral-300 truncate">
                        {v.title}
                      </p>
                      <p className="text-[10px] text-neutral-400 dark:text-neutral-600 mt-0.5">
                        {formatDate(v.createdAt)}
                        {v.note && <span className="ml-2">· {v.note}</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => handlePreview(v.id)}
                        title="預覽此版本"
                        className={`text-[10px] flex items-center gap-1 px-2 py-1 transition-colors ${
                          previewId === v.id
                            ? "text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800"
                            : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                        }`}
                      >
                        <Eye className="w-3 h-3" />
                        預覽
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRestore(v.id)}
                        title="還原到此版本"
                        className="text-[10px] text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 flex items-center gap-1 px-2 py-1 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        還原
                      </button>
                    </div>
                  </div>

                  {/* 內容預覽 */}
                  {previewId === v.id && (
                    <div className="mt-2 border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-3 max-h-48 overflow-y-auto">
                      {loadingPreview ? (
                        <p className="text-xs text-neutral-400">載入中...</p>
                      ) : (
                        <pre className="text-[11px] text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap font-mono leading-relaxed">
                          {previewContent}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
