import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { stripMarkdown } from "@/lib/utils";
import MarkdownContent from "@/app/posts/[slug]/markdown-content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://arch-blog.zeabur.app";
const SITE_NAME = "SITE LAB 敷地實驗室";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  const post = await prisma.post.findFirst({
    where: { slug, published: true },
    select: {
      title: true,
      excerpt: true,
      coverImage: true,
      createdAt: true,
      category: { select: { name: true } },
      tags: { select: { name: true } },
    },
  });

  if (!post) return { title: "文章不存在" };

  const ogImage = post.coverImage || DEFAULT_OG_IMAGE;
  const url = `${SITE_URL}/read/${slug}`;
  const plainExcerpt = stripMarkdown(post.excerpt);

  return {
    title: `${post.title} — ${SITE_NAME}`,
    description: plainExcerpt,
    keywords: post.tags.map((tag) => tag.name),
    robots: { index: false, follow: true },
    openGraph: {
      type: "article",
      title: post.title,
      description: plainExcerpt,
      url,
      siteName: SITE_NAME,
      publishedTime: post.createdAt.toISOString(),
      section: post.category.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: plainExcerpt,
      images: [ogImage],
    },
    alternates: { canonical: `${SITE_URL}/posts/${slug}` },
  };
}

export default async function ReadPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  const post = await prisma.post.findFirst({
    where: { slug, published: true },
    include: {
      category: { select: { name: true } },
      tags: { select: { name: true, slug: true } },
    },
  });

  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    image: post.coverImage || DEFAULT_OG_IMAGE,
    url: `${SITE_URL}/read/${slug}`,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    articleSection: post.category.name,
    keywords: post.tags.map((tag) => tag.name).join(", "),
  };

  return (
    <main className="flex-1 page-enter">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-[700px] mx-auto px-4 py-10 sm:py-14">
        <div className="mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-600 mb-2">
            SITE LAB 敷地實驗室
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
            {post.title}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-3">
            此頁為分享閱讀模式，若要瀏覽完整站內功能請前往
            <Link href={`/posts/${post.slug}`} className="underline underline-offset-2 ml-1 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
              完整文章頁
            </Link>
            。
          </p>
        </div>

        <div className="prose text-neutral-800 dark:text-neutral-300">
          <MarkdownContent content={post.content} />
        </div>
      </article>
    </main>
  );
}
