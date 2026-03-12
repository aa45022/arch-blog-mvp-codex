/**
 * Prisma 唯一入口 — 其他檔案一律 import { prisma } from "@/lib/prisma"
 *
 * 使用 PrismaPg adapter（Prisma 7 Rust-free 架構）
 * global singleton 避免 dev 模式 hot reload 重複建立連線
 */
import { PrismaClient } from "../prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { getDatabaseUrl } from "./db-url.js";

// 宣告 global 型別，讓 TypeScript 認識 globalThis.prisma
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const pool = new pg.Pool({ connectionString: getDatabaseUrl() });
  const adapter = new PrismaPg(pool as unknown as ConstructorParameters<typeof PrismaPg>[0]);
  return new PrismaClient({ adapter });
}

export const prisma: PrismaClient =
  globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}