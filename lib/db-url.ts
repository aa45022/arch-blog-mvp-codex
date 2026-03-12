/**
 * 解析資料庫連線字串 — 相容 Zeabur 自動注入的各種環境變數名稱
 *
 * Zeabur PostgreSQL 服務會注入：
 *   POSTGRES_URI, POSTGRES_HOST, POSTGRES_PORT,
 *   POSTGRES_USERNAME, POSTGRES_PASSWORD, POSTGRES_DATABASE
 *
 * 本地開發使用 .env 裡的 DATABASE_URL
 */
export function getDatabaseUrl(): string {
  // 1. 直接指定的完整連線字串（優先）
  const url =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URI ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_CONNECTION_STRING;

  if (url) return url;

  // 2. 從 Zeabur 個別注入的變數組合
  const host = process.env.POSTGRES_HOST;
  const port = process.env.POSTGRES_PORT || "5432";
  const user = process.env.POSTGRES_USERNAME || process.env.POSTGRES_USER;
  const password = process.env.POSTGRES_PASSWORD;
  const database = process.env.POSTGRES_DATABASE || process.env.POSTGRES_DB;

  if (host && user && password && database) {
    return `postgresql://${user}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
  }

  throw new Error(
    "Missing database connection string. " +
      "Set DATABASE_URL or link a Zeabur PostgreSQL service.",
  );
}
