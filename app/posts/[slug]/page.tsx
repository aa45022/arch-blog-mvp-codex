import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Header from "@/components/header";
import Footer from "@/components/footer";
import MarkdownContent from "./markdown-content";
import ReadingProgress from "@/components/reading-progress";
import TableOfContents from "@/components/table-of-contents";
import BackToTop from "@/components/back-to-top";
import ImageLightbox from "@/components/image-lightbox";
import FontSizeAdjuster from "@/components/font-size-adjuster";
import PostNavigation from "@/components/post-navigation";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://arch-blog.zeabur.app";
const SITE_NAME = "建築學習筆記";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;

// ─── 動態 OG Metadata ───
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    select: { title: true, excerpt: true, coverImage: true, createdAt: true,
      category: { select: { name: true } } },
  });

  if (!post) return { title: "文章不存在" };

  const ogImage = post.coverImage || DEFAULT_OG_IMAGE;
  const url = `${SITE_URL}/posts/${slug}`;

  return {
    title: `${post.title} — ${SITE_NAME}`,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url,
      siteName: SITE_NAME,
      publishedTime: post.createdAt.toISOString(),
      section: post.category.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
    alternates: { canonical: url },
  };
}

/**
 * 計算閱讀時間（中文以 400 字/分鐘估算）
 */
function estimateReadingTime(content: string): number {
  const chars = content.replace(/\s+/g, "").length;
  return Math.max(1, Math.ceil(chars / 400));
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

  if (!post) notFound();

  // 取得上一篇 / 下一篇（同分類，按建立時間排序）
  const [prevPost, nextPost] = await Promise.all([
    prisma.post.findFirst({
      where: { published: true, createdAt: { gt: post.createdAt } },
      orderBy: { createdAt: "asc" },
      select: { title: true, slug: true },
    }),
    prisma.post.findFirst({
      where: { published: true, createdAt: { lt: post.createdAt } },
      orderBy: { createdAt: "desc" },
      select: { title: true, slug: true },
    }),
  ]);

  const date = post.createdAt.toLocaleDateString("zh-TW", {
    year: "numeric", month: "long", day: "numeric",
  });
  const readingTime = estimateReadingTime(post.content);

  return (
    <>
      <ReadingProgress />
      <Header />
      <main className="flex-1">
        <article className="max-w-[680px] mx-auto px-4 py-8 lg:max-w-4xl lg:grid lg:grid-cols-[1fr_180px] lg:gap-8">
          <div>
            {/* 麵包屑 */}
            <nav className="text-xs text-gray-400 dark:text-gray-500 mb-6">
              <Link href="/" className="hover:text-accent">首頁</Link>
              <span className="mx-1.5">›</span>
              <Link href={`/?category=${post.category.slug}`} className="hover:text-accent">
                {post.category.name}
              </Link>
              <span className="mx-1.5">›</span>
              <span className="text-gray-500 dark:text-gray-400">{post.title}</span>
            </nav>

            {/* 文章標頭 */}
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Link href={`/?category=${post.category.slug}`}
                  className="text-xs font-medium text-accent hover:text-accent-dark">
                  {post.category.name}
                </Link>
                <span className="text-xs text-gray-300 dark:text-gray-600">·</span>
                <time className="text-xs text-gray-400 dark:text-gray-500">{date}</time>
                <span className="text-xs text-gray-300 dark:text-gray-600">·</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">約 {readingTime} 分鐘</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-snug mb-4">{post.title}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{post.excerpt}</p>

              {/* 字體大小調整 */}
              <div className="flex items-center justify-end mt-4 gap-2">
                <span className="text-[10px] text-gray-400 dark:text-gray-500">字級</span>
                <FontSizeAdjuster />
              </div>

              {post.coverImage && (
                <Image src={post.coverImage!} alt={post.title}
                  width={680} height={400} className="w-full rounded-lg mt-4 object-cover" />
              )}
            </header>

            {/* 內容 */}
            <div className="prose text-gray-800 dark:text-gray-300">
              <MarkdownContent content={post.content} />
            </div>

            {/* 標籤 */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                {post.tags.map((tag) => (
                  <Link key={tag.slug} href={`/?tag=${tag.slug}`}
                    className="text-xs text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 rounded px-2.5 py-1 hover:text-accent hover:border-accent transition-colors">
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}

            {/* 上一篇 / 下一篇 */}
            <PostNavigation prev={prevPost} next={nextPost} />

            <div className="mt-8">
              <Link href="/" className="text-sm text-accent hover:text-accent-dark">← 返回文章列表</Link>
            </div>
          </div>

          {/* 側邊目錄（桌面版） */}
          <aside className="hidden lg:block">
            <TableOfContents />
          </aside>
        </article>
      </main>
      <Footer />
      <ImageLightbox />
      <BackToTop />
      {/* 手機版 TOC 按鈕 */}
      <div className="lg:hidden">
        <TableOfContents />
      </div>
    </>
  );
}
