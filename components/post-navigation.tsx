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
    <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 grid grid-cols-2 gap-4">
      {/* 上一篇 */}
      {prev ? (
        <Link
          href={`/posts/${prev.slug}`}
          className="group flex items-start gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-accent dark:hover:border-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mt-0.5 text-gray-400 group-hover:text-accent transition-colors flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5">上一篇</p>
            <p className="text-xs text-gray-700 dark:text-gray-300 group-hover:text-accent transition-colors truncate">
              {prev.title}
            </p>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {/* 下一篇 */}
      {next ? (
        <Link
          href={`/posts/${next.slug}`}
          className="group flex items-start gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-accent dark:hover:border-accent transition-colors text-right justify-end"
        >
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5">下一篇</p>
            <p className="text-xs text-gray-700 dark:text-gray-300 group-hover:text-accent transition-colors truncate">
              {next.title}
            </p>
          </div>
          <ArrowRight className="w-4 h-4 mt-0.5 text-gray-400 group-hover:text-accent transition-colors flex-shrink-0" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
