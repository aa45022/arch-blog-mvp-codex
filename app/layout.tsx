import type { Metadata } from "next";
import KeyboardShortcuts from "@/components/keyboard-shortcuts";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://arch-blog.zeabur.app";

/**
 * SITE LAB 敷地實驗室 — Root Layout
 */
export const metadata: Metadata = {
  title: {
    default: "SITE LAB 敷地實驗室",
    template: "%s | SITE LAB",
  },
  description: "SITE LAB 敷地實驗室 — 建築師考試與都市設計學習筆記，涵蓋敷地計畫、韌性城市、TOD、綠色基盤等主題。",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    siteName: "SITE LAB 敷地實驗室",
    locale: "zh_TW",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

// 防止深色模式閃白的 inline script
const themeScript = `
  (function() {
    var t = localStorage.getItem('theme');
    if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head>
        {/* Google Fonts — 宋體標題 + 黑體內文 + 英文幾何體 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&family=Noto+Serif+TC:wght@400;500;700;900&family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="alternate" type="application/rss+xml" title="SITE LAB RSS" href="/feed.xml" />
      </head>
      <body className="font-sans bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-300 min-h-screen flex flex-col transition-colors">
        {children}
        <KeyboardShortcuts />
      </body>
    </html>
  );
}
