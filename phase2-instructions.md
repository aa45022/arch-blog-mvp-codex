# 第 2 階段 — 基礎建設（安裝指令 + 指引）

---

## SPEC v1 摘要

1. Next.js 16.1.x + Prisma 7.4.x + Tailwind 4.2.x + Node 22.x
2. App Router，不用 src/，proxy.ts 做 cookie check
3. Prisma: prisma-client generator + adapter-pg + output ./generated/prisma
4. 白底 accent #2563eb，max-w-[680px]
5. Seed: admin@example.com / changeme123 + 6 篇敷地計畫文章

---

## 本批產出檔案（11 個）

| # | 檔案 | 用途 |
|---|------|------|
| 1 | `package.json` | 依賴、scripts、engines、type:module |
| 2 | `tsconfig.json` | strict:true，@/* alias，其餘 Next.js 管理 |
| 3 | `next.config.ts` | 最小設定，serverExternalPackages: ["pg"] |
| 4 | `postcss.config.mjs` | @tailwindcss/postcss |
| 5 | `app/globals.css` | @import "tailwindcss" + @theme + prose 樣式 |
| 6 | `prisma.config.ts` | defineConfig（datasource url、seed 指令） |
| 7 | `prisma/schema.prisma` | 5 個 model（AdminUser, Post, Category, Tag, Session） |
| 8 | `lib/prisma.ts` | 唯一 Prisma 入口（PrismaPg + pg.Pool + global singleton） |
| 9 | `prisma/seed.ts` | admin + 6 分類 + 18 標籤 + 6 篇文章 |
| 10 | `.env.example` | 環境變數範本 |
| 11 | `.gitignore` | node_modules / .next / .env / prisma/generated |

✅ 本批完成

---

## 本地 PostgreSQL 三選一

| 方案 | 適合 | 安裝方式 | 說明 |
|------|------|---------|------|
| **⭐ Postgres.app** | Mac 使用者（最推薦） | 下載 [postgresapp.com](https://postgresapp.com)，拖進 Applications，開啟即可 | 零設定、GUI 管理、開關一鍵。預設帳號為你的 Mac 使用者名稱，無密碼 |
| Docker | 已熟悉 Docker | `docker run -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16` | 隔離乾淨，但需先安裝 Docker Desktop |
| Homebrew | 偏好命令列 | `brew install postgresql@16 && brew services start postgresql@16` | 背景服務，需手動管理 |

### 選好後，建立資料庫

```bash
# Postgres.app 或 Homebrew（用 psql）
psql -U postgres
CREATE DATABASE arch_blog;
\q

# Docker
docker exec -it <container_id> psql -U postgres -c "CREATE DATABASE arch_blog;"
```

### 設定 .env

```bash
# 複製範本
cp .env.example .env

# 編輯 .env，填入你的連線字串
# Postgres.app（預設無密碼，使用者名為你的 Mac 帳號）：
DATABASE_URL="postgresql://你的Mac帳號@localhost:5432/arch_blog"

# Docker / Homebrew（使用 postgres 帳號）：
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/arch_blog"
```

---

## 安裝指令

```bash
# 1. 確認 Node.js 版本
node -v
# 應為 v22.x.x 或更高

# 2. 進入專案目錄
cd arch-blog-mvp

# 3. 安裝依賴（postinstall 會自動執行 prisma generate）
npm install

# 預期結果：
# - node_modules/ 出現
# - prisma/generated/prisma/ 出現（由 postinstall 自動產生）
# - 終端顯示 "✔ Generated Prisma Client"
```

### 失敗排查

| 問題 | 原因 | 解法 |
|------|------|------|
| `prisma generate` 失敗 | prisma.config.ts 找不到 | 確認檔案在專案根目錄 |
| `Cannot find module '../prisma/generated/...'` | generate 未執行 | 手動跑 `npx prisma generate` |
| Node.js 版本不符 | < 22 | 升級 Node.js：`nvm install 22` 或重新下載 |

---

## Migration + Seed 指令

```bash
# 4. 建立資料庫 migration（首次）
npx prisma migrate dev --name init

# 預期結果：
# - prisma/migrations/ 目錄出現，含 xxxx_init/ 子目錄
# - 終端顯示 "Your database is now in sync with your schema."
# - 自動觸發 prisma generate

# 5. 寫入種子資料
npx prisma db seed

# 預期結果：
# ✓ 管理員：admin@example.com
# ✓ 分類：6 筆
# ✓ 標籤：18 筆
# ✓ 文章：6 篇
# 🎉 種子資料寫入完成！

# 6. 驗證：啟動開發伺服器
npm run dev

# 預期結果：
# - 終端顯示 "Ready in xxxms"
# - 瀏覽 http://localhost:3000 → 會看到 404（因為還沒建前台頁面，正常！）
```

### Migration 失敗排查

| 問題 | 原因 | 解法 |
|------|------|------|
| `Can't reach database server` | PostgreSQL 未啟動或 DATABASE_URL 錯誤 | 確認 PostgreSQL 在跑 + .env 連線字串正確 |
| `database "arch_blog" does not exist` | 還沒建資料庫 | 執行上面的 `CREATE DATABASE arch_blog;` |
| seed 中 bcrypt 錯誤 | 可能缺 native build tools | `npm rebuild bcrypt` |

---

## 驗證資料（可選）

```bash
# 用 Prisma Studio 看資料
npx prisma studio

# 瀏覽器開 http://localhost:5555
# 可以看到 AdminUser / Post / Category / Tag / Session 五個表
# Post 應有 6 筆，全部 published: true
```

---

## ⚠️ 注意事項

1. **prisma.config.ts 放在專案根目錄**（非 prisma/ 下）— 這是 Prisma 7 CLI 預設搜尋位置。與第 1 階段資料夾結構略有調整，以 Prisma 7 實際行為為準。
2. **prisma/generated/ 已在 .gitignore** — 不提交版控，由 postinstall 自動產生。
3. **package-lock.json 必須提交版控** — `npm install` 後會自動產生。

---

## SPEC v2

```
[SPEC_ID: arch-blog-mvp | VERSION: v2 | supersedes: v1]

STACK:
  Next.js 16.1.x (App Router) / Prisma 7.4.x / Tailwind CSS 4.2.x /
  Node.js 22.x / TypeScript 5.x strict / PostgreSQL /
  bcrypt 5.x (12 rounds) / react-markdown 9.x + remark-gfm /
  Cloudinary direct upload / 部署: Zeabur

TOOLING:
  npm (唯一套件管理器) / package-lock.json 提交版控 /
  engines.node: ">=22.0.0" / "type": "module" /
  scripts: dev(next dev --turbopack) / build(next build) / start(next start) / postinstall(prisma generate) /
  不設 packageManager 欄位 / @/* alias (create-next-app 預設)
  PostgreSQL 本地推薦: Postgres.app

ROUTES:
  [PAGE] / → 首頁 (published only)
  [PAGE] /posts/[slug] → 文章頁
  [PAGE] /admin/login → 登入
  [PAGE] /admin/posts → 管理列表
  [PAGE] /admin/posts/new → 新增
  [PAGE] /admin/posts/[id]/edit → 編輯
  [HANDLER] POST /api/login → 登入
  [HANDLER] POST /api/logout → 登出
  [HANDLER] GET|POST /api/posts → 列表|新增
  [HANDLER] GET|PUT|DELETE /api/posts/[id] → 讀|改|刪
  [HANDLER] PATCH /api/posts/[id]/publish → 發佈切換
  [HANDLER] GET /api/categories → 分類列表
  [HANDLER] GET /api/tags → 標籤列表
  [HANDLER] POST /api/upload/sign → Cloudinary 簽章

MODELS:
  AdminUser (id, email, password, createdAt, sessions[])
  Post (id, title, slug, excerpt, content, coverImage?, published, createdAt, updatedAt, categoryId, category, tags[])
  Category (id, name, slug, posts[])
  Tag (id, name, slug, posts[])
  Session (id, token, expiresAt, adminUserId, adminUser)
  多對多: Post ↔ Tag (Prisma implicit)

ENV_VARS:
  DATABASE_URL (server, stage:1)
  APP_URL (server, stage:1)
  CLOUDINARY_CLOUD_NAME (server, stage:1)
  CLOUDINARY_API_KEY (server, stage:1)
  CLOUDINARY_API_SECRET (server, stage:1)
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME (client, stage:1)

AUTH:
  proxy.ts: cookie check + redirect (不碰 DB, 排除 /admin/login)
  lib/auth.ts: validateSession (DB lookup + expiry) + checkOrigin (vs APP_URL)
  cookie: session_token / httpOnly / secure(prod) / sameSite:lax / path:/ / maxAge:86400
  登入失敗: 「帳號或密碼錯誤」(不區分)
  寫入 API: session + origin 雙重檢查

DATA_FLOW:
  前台: Server Components → @/lib/prisma → DB (只讀 published)
  後台頁面: Server Components → @/lib/prisma → DB (含 draft)
  後台寫入: Client Component → fetch → Route Handler → auth.ts → @/lib/prisma → DB
  Cloudinary: Client → /api/upload/sign → Client → Cloudinary API (direct upload)

SECURITY:
  bcrypt 12 rounds / httpOnly cookie / Origin check on mutations /
  react-markdown 不加 rehype-raw / 錯誤不外洩 /
  Cloudinary: 前端 MIME+5MB (app-layer), 後端簽章固定 folder/resource_type/overwrite=false

DESIGN:
  白底 / text-gray-800 / max-w-[680px] / accent: #2563eb /
  @theme { --color-accent: #2563eb; --color-accent-light: #3b82f6; --color-accent-dark: #1d4ed8 } /
  prose class for Markdown / 無動畫 / 手機可操作

OPEN_ASSUMPTIONS:
  1. 單一管理者
  2. Session token 不 hash
  3. 單一 APP_URL
  4. 5MB = app-layer validation
  5. 不做 i18n
  6. 不做 RSS/sitemap
  7. Markdown 不支援 raw HTML
  8. 前台不做分頁
  9. 不做圖片裁切
  10. Category 必填

CHANGELOG:
  [ADD] package.json (dependencies, scripts, engines, type:module)
  [ADD] tsconfig.json (strict:true, @/* alias)
  [ADD] next.config.ts (serverExternalPackages: ["pg"])
  [ADD] postcss.config.mjs (@tailwindcss/postcss)
  [ADD] app/globals.css (@import "tailwindcss" + @theme + .prose)
  [ADD] prisma.config.ts (defineConfig, datasource url, seed command)
  [ADD] prisma/schema.prisma (5 models: AdminUser, Post, Category, Tag, Session)
  [ADD] lib/prisma.ts (PrismaPg + pg.Pool + global singleton)
  [ADD] prisma/seed.ts (admin + 6 categories + 18 tags + 6 posts)
  [ADD] .env.example (DATABASE_URL, APP_URL, CLOUDINARY_*)
  [ADD] .gitignore (node_modules, .next, .env, prisma/generated)
  [MOD] prisma.config.ts 位置從 prisma/ 調整至專案根目錄（符合 Prisma 7 CLI 預設搜尋位置）
  [ADD] @theme 擴增 accent-light, accent-dark 色階

[/SPEC]
```

---

## ✅ 第 2 階段完成

🧪 **驗證清單**：
1. `npm install` → prisma/generated/ 出現 ✓
2. `npx prisma migrate dev --name init` → migrations/ 出現 ✓
3. `npx prisma db seed` → 6 分類 + 18 標籤 + 6 文章 ✓
4. `npm run dev` → Ready in xxxms ✓
5. `npx prisma studio` → 可瀏覽 5 個表 ✓

⏭ **下一步**：第 3 階段 — 前台頁面（layout / 首頁 / 文章頁 / 元件）
