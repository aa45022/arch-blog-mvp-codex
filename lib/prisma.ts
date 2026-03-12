/**
 * Prisma 唯一入口 — 其他檔案一律 import { prisma } from "@/lib/prisma"
 *
 * 使用 PrismaPg adapter（Prisma 7 Rust-free 架構）
 * global singleton 避免 dev 模式 hot reload 重複建立連線
 */
import { PrismaClient } from "../prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

function resolveDatabaseUrl(): string | null {
  return process.env.DATABASE_URL
    || process.env.POSTGRES_PRISMA_URL
    || process.env.POSTGRES_URL
    || process.env.PG_URL
    || null;
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function createPrismaClient(connectionString: string): PrismaClient {
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool as unknown as ConstructorParameters<typeof PrismaPg>[0]);
  return new PrismaClient({ adapter });
}

function createMissingDbProxy(): PrismaClient {
  const errorFactory = () => {
    throw new Error("Missing database connection string. Set DATABASE_URL (preferred) or POSTGRES_PRISMA_URL/POSTGRES_URL/PG_URL.");
  };

  const handler: ProxyHandler<(...args: unknown[]) => unknown> = {
    get() {
      return new Proxy(errorFactory, handler);
    },
    apply() {
      throw new Error("Missing database connection string. Set DATABASE_URL (preferred) or POSTGRES_PRISMA_URL/POSTGRES_URL/PG_URL.");
    },
  };

  return new Proxy(errorFactory, handler) as unknown as PrismaClient;
}

const dbUrl = resolveDatabaseUrl();

export const prisma: PrismaClient =
  dbUrl
    ? (globalThis.prisma ?? createPrismaClient(dbUrl))
    : createMissingDbProxy();

if (process.env.NODE_ENV !== "production" && dbUrl) {
  globalThis.prisma = prisma;
}
