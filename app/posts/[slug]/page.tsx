import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Header from "@/components/header";
import Footer from "@/components/footer";
import MarkdownContent from "./markdown-content";

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

  const date = post.createdAt.toLocaleDateString("zh-TW", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="max-w-[680px] mx-auto px-4 py-8">
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
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-snug mb-4">{post.title}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{post.excerpt}</p>
            {post.coverImage && (
              <Image src={post.coverImage!} alt={post.title}
                width={680} height={400} className="w-full rounded-lg mt-6 object-cover" />
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

          <div className="mt-8">
            <Link href="/" className="text-sm text-accent hover:text-accent-dark">← 返回文章列表</Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
