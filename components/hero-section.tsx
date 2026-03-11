"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import ArchPattern from "./arch-pattern";
import { getArchPatternIndex } from "@/lib/utils";

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
  const parallaxRef = useRef<HTMLDivElement>(null);

  const date = new Date(post.createdAt).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // 視差捲動效果
  useEffect(() => {
    function handleScroll() {
      if (!parallaxRef.current) return;
      const scrollY = window.scrollY;
      const rate = scrollY * 0.3;
      parallaxRef.current.style.transform = `translateY(${rate}px)`;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const patternIndex = getArchPatternIndex(post.slug);

  return (
    <section className="relative -mx-4 mb-16 overflow-hidden">
      <Link href={`/posts/${post.slug}`} className="group block">
        {/* 大圖 — 全寬出血 + 視差 */}
        <div className="relative aspect-[21/9] sm:aspect-[21/8] overflow-hidden">
          <div ref={parallaxRef} className="hero-parallax absolute inset-0 scale-110">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                width={1400}
                height={600}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                priority
              />
            ) : (
              <ArchPattern index={patternIndex} />
            )}
          </div>

          {/* 漸層遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          {/* 精選標記 */}
          <div className="absolute top-0 left-0 bg-white dark:bg-neutral-100 text-neutral-900 text-[10px] font-medium uppercase tracking-widest px-4 py-2 font-display">
            Featured
          </div>

          {/* 文字壓在圖上 */}
          <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-10 pb-8 sm:pb-12">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-medium text-white/80 uppercase tracking-widest font-display">
                  {post.categoryName}
                </span>
                <span className="w-6 border-t border-white/30" />
                <time className="text-[10px] text-white/50">
                  {date}
                </time>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-wide mb-4 group-hover:opacity-80 transition-opacity">
                {post.title}
              </h2>
              <p className="text-sm text-white/50 leading-relaxed line-clamp-2 max-w-2xl hidden sm:block">
                {post.excerpt}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
