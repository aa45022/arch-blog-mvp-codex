/**
 * Prisma 7 設定檔 — 放在專案根目錄（Prisma CLI 預設搜尋位置）
 *
 * ⚠️ generate 不需要 DATABASE_URL（Prisma ≥7.2.0）
 *    只有 migrate / seed 才需要
 */
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  // schema 檔案位置
  schema: "prisma/schema.prisma",

  // 資料庫連線 — 不用 env() helper、不用空字串 fallback
  datasource: {
    url: process.env.DATABASE_URL!,
  },

  // Seed 指令
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
