import Link from "next/link";
import Image from "next/image";

type HeroPost = {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  categoryName: string;
  categorySlug: string;
  createdAt: string;
};

export default function HeroSection({ post }: { post: HeroPost }) {
  const date = new Date(post.createdAt).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="mb-12">
      <Link href={`/posts/${post.slug}`} className="group block">
        {/* 大圖 */}
        <div className="relative aspect-[21/9] overflow-hidden bg-neutral-100 dark:bg-neutral-900 mb-6">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              width={1200}
              height={514}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-neutral-300 dark:text-neutral-700 text-sm tracking-widest uppercase">
                Featured
              </span>
            </div>
          )}
          {/* 精選標記 */}
          <div className="absolute top-0 left-0 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-[10px] font-medium uppercase tracking-widest px-3 py-1.5">
            精選文章
          </div>
        </div>

        {/* 文字資訊 */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-medium text-neutral-900 dark:text-neutral-100 uppercase tracking-widest">
              {post.categoryName}
            </span>
            <span className="w-6 border-t border-neutral-300 dark:border-neutral-700" />
            <time className="text-[10px] text-neutral-400 dark:text-neutral-600">
              {date}
            </time>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight leading-snug mb-3 group-hover:opacity-60 transition-opacity">
            {post.title}
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
        </div>
      </Link>
    </section>
  );
}
