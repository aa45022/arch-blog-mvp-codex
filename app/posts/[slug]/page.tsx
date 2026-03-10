import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Header from "@/components/header";
import Footer from "@/components/footer";
import MarkdownContent from "./markdown-content";

/**
 * 文章詳情頁 — 渲染 Markdown 內容
 * Server Component，資料直接從 DB 讀取
 */

// ─── 動態 metadata ───
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    select: { title: true, excerpt: true },
  });

  if (!post) return { title: "文章不存在" };

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: {
      category: { select: { name: true, slug: true } },
      tags: { select: { name: true, slug: true } },
    },
  });

  // 找不到文章或未發佈 → 404
  if (!post) notFound();

  const date = post.createdAt.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="max-w-[680px] mx-auto px-4 py-8">
          {/* 麵包屑 */}
          <nav className="text-xs text-gray-400 mb-6">
            <Link href="/" className="hover:text-accent">
              首頁
            </Link>
            <span className="mx-1.5">›</span>
            <Link
              href={`/?category=${post.category.slug}`}
              className="hover:text-accent"
            >
              {post.category.name}
            </Link>
            <span className="mx-1.5">›</span>
            <span className="text-gray-500">{post.title}</span>
          </nav>

          {/* 文章標頭 */}
          <header className="mb-8">
            {/* 分類 + 日期 */}
            <div className="flex items-center gap-2 mb-3">
              <Link
                href={`/?category=${post.category.slug}`}
                className="text-xs font-medium text-accent hover:text-accent-dark"
              >
                {post.category.name}
              </Link>
              <span className="text-xs text-gray-300">·</span>
              <time className="text-xs text-gray-400">{date}</time>
            </div>

            {/* 標題 */}
            <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-4">
              {post.title}
            </h1>

            {/* 摘要 */}
            <p className="text-sm text-gray-500 leading-relaxed">
              {post.excerpt}
            </p>

            {/* 封面圖 */}
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full rounded-lg mt-6"
              />
            )}
          </header>

          {/* Markdown 內容 */}
          <div className="prose text-gray-800">
            <MarkdownContent content={post.content} />
          </div>

          {/* 標籤 */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-8 pt-6 border-t border-gray-200">
              {post.tags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/?tag=${tag.slug}`}
                  className="text-xs text-gray-400 border border-gray-200 rounded px-2.5 py-1 hover:text-accent hover:border-accent transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}

          {/* 返回首頁 */}
          <div className="mt-8">
            <Link
              href="/"
              className="text-sm text-accent hover:text-accent-dark"
            >
              ← 返回文章列表
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
