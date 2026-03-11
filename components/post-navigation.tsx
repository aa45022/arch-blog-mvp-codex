import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

type NavPost = {
  title: string;
  slug: string;
} | null;

type PostNavigationProps = {
  prev: NavPost;
  next: NavPost;
};

/**
 * 上一篇/下一篇導覽
 */
export default function PostNavigation({ prev, next }: PostNavigationProps) {
  if (!prev && !next) return null;

  return (
    <div className="mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-2 gap-4">
      {prev ? (
        <Link
          href={`/posts/${prev.slug}`}
          className="group flex items-start gap-2 p-3 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mt-0.5 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200 transition-colors flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] text-neutral-400 dark:text-neutral-600 mb-0.5">上一篇</p>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors truncate">
              {prev.title}
            </p>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/posts/${next.slug}`}
          className="group flex items-start gap-2 p-3 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-400 transition-colors text-right justify-end"
        >
          <div className="min-w-0">
            <p className="text-[10px] text-neutral-400 dark:text-neutral-600 mb-0.5">下一篇</p>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors truncate">
              {next.title}
            </p>
          </div>
          <ArrowRight className="w-4 h-4 mt-0.5 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200 transition-colors flex-shrink-0" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
