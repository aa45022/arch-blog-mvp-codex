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
import RelatedPosts from "@/components/related-posts";
import ViewCounter from "@/components/view-counter";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://arch-blog.zeabur.app";
const SITE_NAME = "SITE LAB 敷地實驗室";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;

// ─── 動態 OG Metadata ───
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const post = await prisma.post.findFirst({
    where: { slug, published: true },
    select: { title: true, excerpt: true, coverImage: true, createdAt: true,
      category: { select: { name: true } }, tags: { select: { name: true } } },
  });

  if (!post) return { title: "文章不存在" };

  const ogImage = post.coverImage || DEFAULT_OG_IMAGE;
  const url = `${SITE_URL}/posts/${slug}`;

  return {
    title: `${post.title} — ${SITE_NAME}`,
    description: post.excerpt,
    keywords: post.tags.map((t) => t.name),
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
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  const post = await prisma.post.findFirst({
    where: { slug, published: true },
    include: {
      category: { select: { name: true, slug: true } },
      tags: { select: { name: true, slug: true } },
    },
  });

  if (!post) notFound();

  // 上一篇 / 下一篇 + 相關文章
  const [prevPost, nextPost, relatedPosts] = await Promise.all([
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
    // 相關文章：同分類或同標籤，排除自己，最多 3 篇
    prisma.post.findMany({
      where: {
        published: true,
        id: { not: post.id },
        OR: [
          { categoryId: post.categoryId },
          { tags: { some: { slug: { in: post.tags.map((t) => t.slug) } } } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { title: true, slug: true, excerpt: true, coverImage: true, createdAt: true },
    }),
  ]);

  const date = post.createdAt.toLocaleDateString("zh-TW", {
    year: "numeric", month: "long", day: "numeric",
  });
  const readingTime = estimateReadingTime(post.content);

  // JSON-LD 結構化資料
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    image: post.coverImage || DEFAULT_OG_IMAGE,
    url: `${SITE_URL}/posts/${slug}`,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    articleSection: post.category.name,
    keywords: post.tags.map((t) => t.name).join(", "),
  };

  return (
    <>
      <ReadingProgress />
      <Header />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1">
        <article className="max-w-[680px] mx-auto px-4 py-10 lg:max-w-4xl lg:grid lg:grid-cols-[1fr_180px] lg:gap-8">
          <div>
            {/* 麵包屑 */}
            <nav className="text-[10px] text-neutral-400 dark:text-neutral-600 mb-8 uppercase tracking-wider">
              <Link href="/" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">首頁</Link>
              <span className="mx-2">—</span>
              <Link href={`/?category=${post.category.slug}`} className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
                {post.category.name}
              </Link>
            </nav>

            {/* 文章標頭 */}
            <header className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <Link href={`/?category=${post.category.slug}`}
                  className="text-[10px] font-medium text-neutral-900 dark:text-neutral-100 uppercase tracking-widest hover:opacity-60 transition-opacity">
                  {post.category.name}
                </Link>
                <span className="w-4 border-t border-neutral-300 dark:border-neutral-700" />
                <time className="text-[10px] text-neutral-400 dark:text-neutral-600">{date}</time>
                <span className="w-4 border-t border-neutral-300 dark:border-neutral-700" />
                <span className="text-[10px] text-neutral-400 dark:text-neutral-600">約 {readingTime} 分鐘</span>
                <span className="w-4 border-t border-neutral-300 dark:border-neutral-700" />
                <ViewCounter postId={post.id} initialCount={post.viewCount} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 leading-snug tracking-tight mb-4">{post.title}</h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{post.excerpt}</p>

              {/* 字體大小調整 */}
              <div className="flex items-center justify-end mt-6 gap-2">
                <span className="text-[10px] text-neutral-400 dark:text-neutral-600">字級</span>
                <FontSizeAdjuster />
              </div>

              {post.coverImage && (
                <Image src={post.coverImage!} alt={post.title}
                  width={680} height={400} className="w-full mt-6 object-cover" />
              )}
            </header>

            {/* 內容 */}
            <div className="prose text-neutral-800 dark:text-neutral-300">
              <MarkdownContent content={post.content} />
            </div>

            {/* 標籤 */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                {post.tags.map((tag) => (
                  <Link key={tag.slug} href={`/?tag=${tag.slug}`}
                    className="text-[10px] text-neutral-400 dark:text-neutral-500 border border-neutral-200 dark:border-neutral-800 px-2.5 py-1 hover:text-neutral-900 hover:border-neutral-900 dark:hover:text-neutral-200 dark:hover:border-neutral-400 transition-colors">
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}

            {/* 上一篇 / 下一篇 */}
            <PostNavigation prev={prevPost} next={nextPost} />

            {/* 相關文章 */}
            <RelatedPosts posts={relatedPosts} />

            <div className="mt-8">
              <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
                ← 返回文章列表
              </Link>
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
