import type { Metadata } from "next";
import "./globals.css";

/**
 * 全站 Root Layout
 * - 載入 globals.css（Tailwind + @theme + prose）
 * - 設定全站 metadata
 */
export const metadata: Metadata = {
  title: {
    default: "建築學習筆記",
    template: "%s | 建築學習筆記",
  },
  description: "建築師考試與都市設計學習筆記，涵蓋敷地計畫、韌性城市、TOD、綠色基盤等主題。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className="bg-white text-gray-800 min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
