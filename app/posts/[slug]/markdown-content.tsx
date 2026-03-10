import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Markdown 渲染元件
 * - react-markdown + remark-gfm（支援表格、刪除線等）
 * - 不加 rehype-raw（安全預設，防 XSS）
 * - 若未來需要 trusted HTML → 🚨 BREAKING CHANGE
 */
export default function MarkdownContent({ content }: { content: string }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
}
