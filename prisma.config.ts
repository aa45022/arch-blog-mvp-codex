import "dotenv/config";
import { defineConfig } from "prisma/config";

function resolveDatabaseUrl(): string {
  const url = process.env.DATABASE_URL
    || process.env.POSTGRES_PRISMA_URL
    || process.env.POSTGRES_URL
    || process.env.PG_URL;

  if (!url) {
    throw new Error(
      "Missing database connection string. Please set DATABASE_URL (preferred) or POSTGRES_PRISMA_URL/POSTGRES_URL/PG_URL."
    );
  }

  return url;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: resolveDatabaseUrl(),
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
