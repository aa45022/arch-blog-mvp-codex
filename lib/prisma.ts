/**
 * Prisma 唯一入口 — 其他檔案一律 import { prisma } from "@/lib/prisma"
 *
 * 使用 PrismaPg adapter（Prisma 7 Rust-free 架構）
 * global singleton 避免 dev 模式 hot reload 重複建立連線
 */
import { PrismaClient } from "../prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// 宣告 global 型別，讓 TypeScript 認識 globalThis.prisma
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  // pg.Pool — PrismaPg adapter 需要 Pool 實例
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapter = new PrismaPg(pool as any);
  return new PrismaClient({ adapter });
}

// Dev 模式：存在 globalThis 上避免 hot reload 重複連線
// Production：每次啟動建立一個實例
export const prisma: PrismaClient =
  globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
