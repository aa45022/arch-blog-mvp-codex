import type { Metadata } from "next";
import "./globals.css";

/**
 * SITE LAB 敷地實驗室 — Root Layout
 */
export const metadata: Metadata = {
  title: {
    default: "SITE LAB 敷地實驗室",
    template: "%s | SITE LAB",
  },
  description: "SITE LAB 敷地實驗室 — 建築師考試與都市設計學習筆記，涵蓋敷地計畫、韌性城市、TOD、綠色基盤等主題。",
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
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-300 min-h-screen flex flex-col transition-colors">
        {children}
      </body>
    </html>
  );
}
