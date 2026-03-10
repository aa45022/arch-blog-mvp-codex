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
    <article className="cursor-pointer border border-gray-200 bg-white transition-shadow hover:shadow-md">
      {/* 封面圖 */}
      <div className="relative">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            width={800}
            height={400}
            className="w-full h-52 object-cover"
          />
        ) : (
          <div className="w-full h-52 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-xs">無封面圖片</span>
          </div>
        )}
        {/* 分類標籤（疊在圖片上） */}
        <Link
          href={`/?category=${categorySlug}`}
          className="absolute top-0 left-0 bg-white px-2 py-0.5 text-[10px] font-medium text-black uppercase tracking-wider hover:bg-accent hover:text-white transition-colors"
        >
          #{categoryName}
        </Link>
      </div>

      {/* 內容 */}
      <div className="px-4 py-4">
        <Link href={`/posts/${slug}`} className="block group">
          <h2 className="text-base font-normal text-gray-900 tracking-tight mb-2 group-hover:text-accent transition-colors leading-snug">
            {title}
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            {excerpt}
          </p>
        </Link>

        {/* Read more + 日期 */}
        <div className="flex items-center justify-between">
          <Link
            href={`/posts/${slug}`}
            className="group relative flex items-center font-medium text-gray-900 text-xs hover:text-gray-700 transition-colors"
          >
            <span className="mr-2 relative flex items-center overflow-hidden border border-gray-200 p-2 transition-colors duration-300 group-hover:bg-black group-hover:text-white">
              <ArrowRight className="h-3 w-3 translate-x-0 opacity-100 transition-all duration-500 group-hover:translate-x-6 group-hover:opacity-0" />
              <ArrowRight className="absolute h-3 w-3 -left-3 transition-all duration-500 group-hover:left-2" />
            </span>
            閱讀全文
          </Link>
          <span className="flex items-center gap-2 text-[10px] text-gray-400">
            {date}
            <span className="w-8 border-t border-gray-300" />
          </span>
        </div>

        {/* 標籤 */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
            {tags.map((tag) => (
              <Link key={tag.slug} href={`/?tag=${tag.slug}`}
                className="text-[10px] text-gray-400 border border-gray-200 rounded px-2 py-0.5 hover:text-accent hover:border-accent transition-colors">
                {tag.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
