import Link from "next/link";

/**
 * 文章卡片 — 首頁列表用
 *
 * Props 型別直接定義，不依賴 Prisma generated types
 * （避免 Client Component 間接 import Prisma 的風險）
 */
type PostCardProps = {
  title: string;
  slug: string;
  excerpt: string;
  categoryName: string;
  categorySlug: string;
  tags: { name: string; slug: string }[];
  createdAt: string; // ISO string，由 Server Component 傳入
};

export default function PostCard({
  title,
  slug,
  excerpt,
  categoryName,
  categorySlug,
  tags,
  createdAt,
}: PostCardProps) {
  // 格式化日期
  const date = new Date(createdAt).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="border border-gray-200 rounded-lg p-5 hover:border-accent transition-colors">
      <Link href={`/posts/${slug}`} className="block">
        {/* 分類 + 日期 */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-accent">
            {categoryName}
          </span>
          <span className="text-xs text-gray-400">·</span>
          <span className="text-xs text-gray-400">{date}</span>
        </div>

        {/* 標題 */}
        <h2 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
          {title}
        </h2>

        {/* 摘要 */}
        <p className="text-sm text-gray-500 leading-relaxed mb-3">
          {excerpt}
        </p>
      </Link>

      {/* 標籤 */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/?tag=${tag.slug}`}
              className="text-xs text-gray-400 border border-gray-200 rounded px-2 py-0.5 hover:text-accent hover:border-accent transition-colors"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
