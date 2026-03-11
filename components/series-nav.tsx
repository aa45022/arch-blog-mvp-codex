import Link from "next/link";
import { ChevronRight } from "lucide-react";

type SeriesPost = {
  id: number;
  title: string;
  slug: string;
  seriesOrder: number | null;
};

type SeriesNavProps = {
  seriesTitle: string;
  seriesSlug: string;
  posts: SeriesPost[];
  currentPostId: number;
};

/**
 * 文章系列導覽條
 * 顯示在文章標頭下方，列出系列內所有文章
 */
export default function SeriesNav({ seriesTitle, seriesSlug, posts, currentPostId }: SeriesNavProps) {
  if (posts.length <= 1) return null;

  const sorted = [...posts].sort((a, b) => (a.seriesOrder ?? 999) - (b.seriesOrder ?? 999));
  const currentIndex = sorted.findIndex((p) => p.id === currentPostId);

  return (
    <div className="my-8 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
      {/* 系列標題 */}
      <div className="px-5 py-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-neutral-400 dark:text-neutral-600 uppercase tracking-widest font-display mb-0.5">
            Series
          </p>
          <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 font-serif tracking-wide">
            {seriesTitle}
          </p>
        </div>
        <span className="text-[10px] text-neutral-400 dark:text-neutral-600">
          {currentIndex + 1} / {sorted.length}
        </span>
      </div>

      {/* 文章列表 */}
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {sorted.map((post, i) => {
          const isCurrent = post.id === currentPostId;
          return (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className={`flex items-center gap-3 px-5 py-2.5 text-xs transition-colors ${
                isCurrent
                  ? "bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-medium"
                  : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-white dark:hover:bg-neutral-950"
              }`}
            >
              <span className={`w-5 h-5 flex items-center justify-center text-[10px] border shrink-0 ${
                isCurrent
                  ? "border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100"
                  : "border-neutral-300 dark:border-neutral-700"
              }`}>
                {i + 1}
              </span>
              <span className="truncate">{post.title}</span>
              {isCurrent && <ChevronRight className="w-3 h-3 ml-auto shrink-0" />}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
