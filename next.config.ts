import type { NextConfig } from "next";

/**
 * Next.js 設定 — 保持最小化
 * 若部署體積過大，第 5 階段再加 output: "standalone"
 */
const nextConfig: NextConfig = {
  // pg 模組需要 Node.js native modules，避免 bundler 打包出錯
  serverExternalPackages: ["pg"],
};

export default nextConfig;
