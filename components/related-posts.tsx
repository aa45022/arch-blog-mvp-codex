import Link from "next/link";
import Image from "next/image";

type RelatedPost = {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  createdAt: Date;
};

export default function RelatedPosts({ posts }: { posts: RelatedPost[] }) {
  if (posts.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
      <p className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.2em] mb-6">
        Related Articles
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/posts/${post.slug}`} className="group block">
            <div className="aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-900 mb-3">
              {post.coverImage ? (
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  width={400}
                  height={250}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-neutral-300 dark:text-neutral-700 text-[10px] tracking-wider">
                    No Image
                  </span>
                </div>
              )}
            </div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 leading-snug group-hover:opacity-60 transition-opacity">
              {post.title}
            </h3>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 line-clamp-1">
              {post.excerpt}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
