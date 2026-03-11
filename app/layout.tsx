import type { Metadata } from "next";
import "./globals.css";

/**
 * 全站 Root Layout
 * - 載入 globals.css（Tailwind + @theme + prose）
 * - 設定全站 metadata
 * - 內嵌 script 防止深色模式閃白
 */
export const metadata: Metadata = {
  title: {
    default: "建築學習筆記",
    template: "%s | 建築學習筆記",
  },
  description: "建築師考試與都市設計學習筆記，涵蓋敷地計畫、韌性城市、TOD、綠色基盤等主題。",
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
      <body className="bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200 min-h-screen flex flex-col transition-colors">
        {children}
      </body>
    </html>
  );
}
