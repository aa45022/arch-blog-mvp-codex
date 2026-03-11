/**
 * SITE LAB — 工具函數
 */

/**
 * 去除 Markdown 語法，回傳純文字
 * 用於：首頁卡片摘要、SEO meta description、RSS feed
 */
export function stripMarkdown(md: string): string {
  return md
    // 移除圖片
    .replace(/!\[.*?\]\(.*?\)/g, "")
    // 移除連結但保留文字
    .replace(/\[(.+?)\]\(.*?\)/g, "$1")
    // 移除標題符號
    .replace(/^#{1,6}\s+/gm, "")
    // 移除粗體/斜體
    .replace(/\*{1,3}(.+?)\*{1,3}/g, "$1")
    // 移除刪除線
    .replace(/~~(.+?)~~/g, "$1")
    // 移除行內程式碼
    .replace(/`([^`]+)`/g, "$1")
    // 移除程式碼區塊
    .replace(/```[\s\S]*?```/g, "")
    // 移除引用符號
    .replace(/^>\s+/gm, "")
    // 移除列表符號
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    // 移除表格
    .replace(/\|.*\|/g, "")
    .replace(/^[-|:\s]+$/gm, "")
    // 移除水平線
    .replace(/^---+$/gm, "")
    // 移除 HTML 標籤
    .replace(/<[^>]+>/g, "")
    // 清理多餘空行
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * 建築紋理 SVG pattern — 無封面圖時隨機顯示
 * 基於文章 slug 或 id 的 hash 來決定圖案
 */
export function getArchPatternIndex(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash) % 6;
}
