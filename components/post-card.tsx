import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

type PostCardProps = {
  title: string;
  slug: string;
  excerpt: string;
  categoryName: string;
  categorySlug: string;
  tags: { name: string; slug: string }[];
  createdAt: string;
  coverImage?: string | null;
};

export default function PostCard({
  title, slug, excerpt, categoryName, categorySlug,
  tags, createdAt, coverImage,
}: PostCardProps) {
  const date = new Date(createdAt).toLocaleDateString("zh-TW", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <article className="group cursor-pointer bg-white dark:bg-neutral-950">
      {/* 封面圖 — 大圖，雜誌感 */}
      <Link href={`/posts/${slug}`} className="block overflow-hidden">
        <div className="relative aspect-[16/10] overflow-hidden">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              width={800}
              height={500}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
              <span className="text-neutral-300 dark:text-neutral-700 text-xs tracking-wider uppercase">No Image</span>
            </div>
          )}
        </div>
      </Link>

      {/* 內容 */}
      <div className="pt-4 pb-6">
        {/* 分類 + 日期 */}
        <div className="flex items-center gap-2 mb-3">
          <Link
            href={`/?category=${categorySlug}`}
            className="text-[10px] font-medium text-neutral-900 dark:text-neutral-100 uppercase tracking-widest hover:opacity-60 transition-opacity"
          >
            {categoryName}
          </Link>
          <span className="w-4 border-t border-neutral-300 dark:border-neutral-700" />
          <time className="text-[10px] text-neutral-400 dark:text-neutral-600">{date}</time>
        </div>

        {/* 標題 */}
        <Link href={`/posts/${slug}`} className="block">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 tracking-tight leading-snug mb-2 group-hover:opacity-60 transition-opacity">
            {title}
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2">
            {excerpt}
          </p>
        </Link>

        {/* Read more */}
        <Link
          href={`/posts/${slug}`}
          className="inline-flex items-center gap-2 mt-4 text-xs font-medium text-neutral-900 dark:text-neutral-200 hover:opacity-60 transition-opacity uppercase tracking-wider"
        >
          閱讀全文
          <ArrowRight className="w-3 h-3" />
        </Link>

        {/* 標籤 */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            {tags.map((tag) => (
              <Link key={tag.slug} href={`/?tag=${tag.slug}`}
                className="text-[10px] text-neutral-400 dark:text-neutral-500 border border-neutral-200 dark:border-neutral-800 px-2 py-0.5 hover:text-neutral-900 hover:border-neutral-900 dark:hover:text-neutral-200 dark:hover:border-neutral-200 transition-colors">
                {tag.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
