# SITE LAB 現況盤點與優化提案（第一輪閱讀）

> 目的：先完整理解目前程式碼，再對照你提供的四階段規劃，提出「可執行」的修改策略，作為我們下一輪討論與實作依據。

## 1) 目前專案已具備的能力（對照你的規劃）

### Phase 1（已部分完成）
- 已有 `generateMetadata`，包含 `openGraph`、`twitter`、canonical，且為每篇文章動態輸出。  
- 已有文章頁 JSON-LD（`Article`）。  
- 已有 sitemap 與 RSS（`/sitemap.xml`、`/feed.xml`）。  
- 已有閱讀時間估算（目前用中文 400 字/分鐘）。

### Phase 2（已完成不少）
- 已有分類（Category）、標籤（Tag）與多對多文章標籤結構。  
- 已有系列文章（Series + seriesOrder）。  
- 已有版本歷史（`PostVersion` + API）。  
- 已有媒體庫（`Media` + API + 管理頁）。  
- 已有相關文章、目錄、分享、收藏、留言（Giscus）等閱讀增強。

### Phase 3（已部分完成）
- 已有文章 CRUD API、上傳 API、統計 API、批次 API。  
- 已有瀏覽數（`viewCount`）與前台顯示。

---

## 2) 與你的目標相比，關鍵缺口（優先順序）

## P0（建議先做，直接影響分享/SEO/閱讀）

1. **獨立分享閱讀頁（Share Mode）尚未落地**  
   - 目前只有 `/posts/[slug]` 完整頁，尚無你要的「只看本文」極簡頁。  
   - 建議採 **作法 A：新增 `/read/[slug]`**（URL 乾淨、可做獨立 SEO/追蹤）。

2. **OG 圖片策略仍可強化**  
   - 目前使用封面圖或預設圖，還未做到每篇一致化的動態生成 OG（標題+底圖 1200x630）。  
   - 建議新增 `app/og/posts/[slug]/route.tsx`（`ImageResponse`）並在 metadata 指向它。

3. **JSON-LD 只有 Article，缺 BreadcrumbList**  
   - 可再補 breadcrumbs schema（首頁 > 分類 > 文章）。

4. **閱讀難度欄位尚未資料化**  
   - 目前只有閱讀時間，沒有「入門/進階/專業」。  
   - 建議新增 `difficulty` enum 到 `Post`，後台可選，前台顯示。

5. **引用格式自動生成（APA/Chicago）尚未實作**  
   - 建議先做最小可行版本：文章底部自動輸出兩種格式 + 一鍵複製。

## P1（第二波，內容架構與工作流）

1. **文章狀態流程目前仍偏二元（published boolean）**  
   - 你的目標是 draft/review/scheduled/published/archived 五狀態。  
   - 建議先引入 `status` enum，保留 `published` 一段時間做相容，最後再移除。

2. **Faceted Search 還不完整**  
   - 現況有分類/標籤，但缺地理區域、複合篩選 UI 與後端 query 策略（索引也要配套）。

3. **Markdown Callout 區塊尚未支援你指定語法**  
   - 目前 `react-markdown + remark-gfm`，但沒有 `:::highlight / :::takeaway / :::quote` 轉元件流程。  
   - 建議導入 `remark-directive` + 自訂 AST 轉換。

4. **草稿預覽 token URL 尚未落地**  
   - 可新增 `PostPreviewToken` table 與 `/preview/[token]` route。

## P2/P3（可排入後續）
- Newsletter 訂閱（資料表 + double opt-in）。
- PageView 明細表（目前多為總計 viewCount，缺 referrer/device 維度）。
- 404/空狀態視覺優化。
- 多語系、投稿、批次管理深化。

---

## 3) 我建議的「實作順序」

### Sprint A（1~1.5 週）— 分享與 SEO 基礎完成
1. `/read/[slug]` 極簡頁 + 可選 noindex。  
2. 動態 OG 圖片路由 + metadata 指向。  
3. `BreadcrumbList` JSON-LD。  
4. canonical / social URL 一致性檢查（避免分享網址分裂）。

### Sprint B（1 週）— 閱讀資訊強化
1. `Post.difficulty` schema + 後台欄位。  
2. APA/Chicago 引用區塊元件。  
3. 閱讀時間與難度在卡片/列表同步顯示。

### Sprint C（1.5~2 週）— 編輯器與內容結構
1. Callout 語法支援（A/B/C 三款樣式）。  
2. 法條引用框、Info/Warning/Tip 元件。  
3. 預覽 token 功能。

### Sprint D（2 週）— 工作流與自動化
1. `status` enum 五階段流程。  
2. 排程發布（cron/Zeabur task）。  
3. n8n 專用 API Key 機制（避免綁管理員 session/cookie）。

---

## 4) 針對你提案，我額外發現可再優化的點

1. **目前 Prism 語法高亮走 CDN 動態注入**  
   - 優點：快上線。缺點：離線性、CSP、首次渲染穩定性較差。  
   - 可改為本地化 highlighter（如 Shiki）減少 runtime 注入。

2. **SEO 路徑命名可標準化**  
   - 現在是 `app/sitemap.xml/route.ts`、`app/feed.xml/route.ts`（可用），但建議補 `robots` 內明確 sitemap URL，並加入 `lastmod` 策略一致化。

3. **資料層建議補索引與約束**  
   - 例如 `Post(status, publishedAt desc)`、`Post(seriesId, seriesOrder)`、`PageView(postId, createdAt)`（未來）等，先為 faceted search 與排行榜鋪路。

4. **API 權限模型要區分「後台人員」與「自動化機器人」**  
   - 目前 API 多數依賴管理員 session，不利 n8n server-to-server。  
   - 建議新增 `X-API-Key` / HMAC webhook 驗簽。

5. **可觀測性（Observability）還可補**  
   - 建議加入錯誤追蹤（Sentry）與核心事件埋點（文章發布、分享、收藏）來量化每次迭代成效。

---

## 5) 建議我們下一步的討論方式

請你先確認下面 4 件事，我就可以直接進入實作：

1. **Share Mode 路線**：採你偏好的作法 A（`/read/[slug]`）嗎？  
2. **Callout 優先樣式**：先做 Style A + Style B，Style C 第二批上線可以嗎？  
3. **難度等級定義**：固定三段（入門/進階/專業）是否足夠？  
4. **n8n 安全策略**：你偏向 API Key 還是 webhook 驗簽（或兩者都要）？

若你同意，我會以 **Sprint A + Sprint B** 為第一批提交，先把分享、SEO、閱讀資訊一次補齊。
