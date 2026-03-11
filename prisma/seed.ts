/**
 * 種子資料 — 建立管理員 + 分類 + 標籤 + 6 篇範例文章
 *
 * 執行方式：npx prisma db seed
 * 🎨 上線前務必修改 admin 密碼！
 */
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcrypt";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool as unknown as ConstructorParameters<typeof PrismaPg>[0]);
const prisma = new PrismaClient({ adapter });

// ─── 分類資料 ───
const categories = [
  { name: "韌性城市", slug: "resilient-city" },
  { name: "TOD", slug: "tod" },
  { name: "綠色基盤", slug: "green-infrastructure" },
  { name: "都市更新", slug: "urban-renewal" },
  { name: "社區營造", slug: "community-planning" },
  { name: "氣候調適", slug: "climate-adaptation" },
];

// ─── 標籤資料 ───
const tags = [
  { name: "防災", slug: "disaster-prevention" },
  { name: "韌性", slug: "resilience" },
  { name: "氣候調適", slug: "climate-adaptation" },
  { name: "TOD", slug: "tod" },
  { name: "交通", slug: "transportation" },
  { name: "混合使用", slug: "mixed-use" },
  { name: "生態", slug: "ecology" },
  { name: "綠建築", slug: "green-building" },
  { name: "海綿城市", slug: "sponge-city" },
  { name: "都更", slug: "urban-renewal" },
  { name: "歷史", slug: "heritage" },
  { name: "活化再生", slug: "revitalization" },
  { name: "社區", slug: "community" },
  { name: "鄰里", slug: "neighborhood" },
  { name: "公共空間", slug: "public-space" },
  { name: "永續", slug: "sustainability" },
  { name: "減碳", slug: "carbon-reduction" },
  { name: "微氣候", slug: "microclimate" },
];

// ─── 文章資料（從 site-planning 知識庫轉換）───
const posts = [
  {
    title: "韌性城市與防災敷地計畫",
    slug: "resilient-city-disaster-planning",
    excerpt: "探討垂直分層與雙模設計如何打造韌性城市的敷地計畫，結合 Kevin Lynch 五元素理論。",
    categorySlug: "resilient-city",
    tagSlugs: ["disaster-prevention", "resilience", "climate-adaptation"],
    content: `## 答題框架：垂直分層 × 雙模設計

### 核心要點

1. **地下層**：滯洪池、雨水貯留、地下調節池、停車場轉運
2. **地面層**：透水鋪面、生態草溝、避難廣場、救災動線
3. **屋頂層**：綠屋頂、太陽能、雨水收集、避難平台
4. **平時模式**：開放空間、社區活動、景觀休憩
5. **災時模式**：避難收容、物資集散、緊急醫療站

### 理論基礎

Kevin Lynch 五元素：路徑（Path）、邊緣（Edge）、區域（District）、節點（Node）、地標（Landmark）

### 答題策略

答題時先畫出「三層剖面圖」標註平時／災時功能切換，再以 Lynch 五元素組織空間敘述，最後用表格對比平時與災時的機能配置。`,
  },
  {
    title: "TOD 大眾運輸導向發展",
    slug: "tod-transit-oriented-development",
    excerpt: "以 Peter Calthorpe TOD 理論為基礎，探討同心圓分區與步行可及性的敷地規劃策略。",
    categorySlug: "tod",
    tagSlugs: ["tod", "transportation", "mixed-use"],
    content: `## 答題框架：同心圓分區 × 步行可及性

### 核心要點

1. **核心區（0-200m）**：站體、轉運設施、高密度商業
2. **混合區（200-400m）**：商住混合、公共設施、開放空間
3. **住宅區（400-800m）**：中低密度住宅、社區公園、學校
4. **步行優先**：人行道 ≧ 3m、自行車道、無障礙設計
5. **密度梯度**：由核心向外遞減，容積獎勵引導開發

### 理論基礎

Peter Calthorpe TOD 理論：以公共運輸站點為中心，步行可及範圍內混合土地使用

### 答題策略

畫同心圓配置圖標示密度梯度，搭配剖面圖呈現建築量體與開放空間關係，強調「最後一哩」接駁策略。`,
  },
  {
    title: "綠色基盤設施與生態都市",
    slug: "green-infrastructure-eco-city",
    excerpt: "從藍綠網絡與生態廊道出發，整合 LID 低衝擊開發，建構海綿城市的敷地策略。",
    categorySlug: "green-infrastructure",
    tagSlugs: ["ecology", "green-building", "sponge-city"],
    content: `## 答題框架：藍綠網絡 × 生態廊道

### 核心要點

1. **藍色系統**：雨水花園、生態滯留池、透水層、濕地
2. **綠色系統**：行道樹、綠帶、公園綠地、屋頂農園
3. **廊道串連**：生態跳島、綠色通廊、風廊、視覺軸線
4. **LID 低衝擊開發**：源頭減量、入滲增加、延遲排放
5. **生物多樣性**：棲地營造、原生植栽、生態池

### 理論基礎

Ian McHarg《Design with Nature》適地適性規劃；海綿城市六字訣：滲、滯、蓄、淨、用、排

### 答題策略

以全區配置圖標示藍綠網絡系統，用箭頭表示水文循環路徑，搭配量化指標（透水率、綠覆率、保水量）強化說服力。`,
  },
  {
    title: "都市更新與歷史保存",
    slug: "urban-renewal-heritage-preservation",
    excerpt: "探討保存層級與介入強度的光譜，透過都市縫合理論處理新舊建築對話。",
    categorySlug: "urban-renewal",
    tagSlugs: ["urban-renewal", "heritage", "revitalization"],
    content: `## 答題框架：保存層級 × 介入強度

### 核心要點

1. **全面保存**：古蹟指定、歷史建築登錄、原貌修復
2. **部分保存**：立面保存、結構補強、內部更新
3. **意象延續**：量體退縮、材料呼應、天際線協調
4. **新舊對話**：新建築謙遜姿態、空間留白、視覺通透
5. **社區參與**：居民工作坊、在地記憶保存、漸進式更新

### 理論基礎

都市縫合（Urban Stitching）理論；Aldo Rossi 都市建築學：集體記憶與場所精神

### 答題策略

繪製新舊建築關係圖，用剖面表現高度退縮與天際線，標註保存元素與新建元素的材質對比策略。`,
  },
  {
    title: "社區規劃與鄰里單元",
    slug: "community-planning-neighborhood-unit",
    excerpt: "從 Clarence Perry 鄰里單元到 Jane Jacobs 四條件，探討社區空間的公共性層級設計。",
    categorySlug: "community-planning",
    tagSlugs: ["community", "neighborhood", "public-space"],
    content: `## 答題框架：鄰里單元 × 公共性層級

### 核心要點

1. **Clarence Perry 鄰里單元**：步行 5 分鐘範圍、小學為中心
2. **公共空間層級**：私密 → 半私密 → 半公共 → 公共
3. **社區核心**：活動中心、市場、廣場、綠地
4. **安全監控**：街道之眼（Eyes on the Street）、通視性
5. **通用設計**：無障礙、高齡友善、兒童安全

### 理論基礎

Jane Jacobs《偉大城市的誕生與衰亡》四條件：混合使用、短街廓、新舊建築混合、高密度

### 答題策略

從鄰里單元配置圖出發，標註步行圈與服務半徑，再以空間層級剖面圖說明公共到私密的過渡設計。`,
  },
  {
    title: "氣候調適與永續敷地",
    slug: "climate-adaptation-sustainable-site",
    excerpt: "以 Olgyay 生物氣候設計法為基礎，探討被動設計與微氣候調節的敷地策略。",
    categorySlug: "climate-adaptation",
    tagSlugs: ["sustainability", "carbon-reduction", "microclimate"],
    content: `## 答題框架：被動設計 × 微氣候調節

### 核心要點

1. **日照分析**：建築座向、日影模擬、冬暖夏涼
2. **通風設計**：風廊規劃、建築間距、壓力差通風
3. **遮陽策略**：騎樓、遮陽板、植栽遮蔭、深窗
4. **熱島緩解**：透水面、植栽、高反射材料、水體
5. **碳中和策略**：再生能源、碳匯綠地、低碳交通

### 理論基礎

Olgyay 生物氣候設計法；被動式設計（Passive Design）原則：適應氣候而非對抗氣候

### 答題策略

繪製基地微氣候分析圖（風向、日照、溫度分布），以此推導配置邏輯，展現「因地制宜」的設計思維。`,
  },
];

// ═══════════════════════════════════════════════
// 執行 Seed
// ═══════════════════════════════════════════════
async function main() {
  console.log("🌱 開始寫入種子資料...\n");

  // 1. 建立管理員
  // 🎨 上線前務必修改密碼！
  const hashedPassword = await bcrypt.hash("changeme123", 12);
  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: hashedPassword,
    },
  });
  console.log(`✓ 管理員：${admin.email}`);

  // 2. 建立分類
  const categoryMap: Record<string, number> = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap[cat.slug] = created.id;
  }
  console.log(`✓ 分類：${categories.length} 筆`);

  // 3. 建立標籤
  const tagMap: Record<string, number> = {};
  for (const tag of tags) {
    const created = await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
    tagMap[tag.slug] = created.id;
  }
  console.log(`✓ 標籤：${tags.length} 筆`);

  // 4. 建立文章
  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        published: true, // 種子文章預設發佈
        categoryId: categoryMap[post.categorySlug]!,
        tags: {
          connect: post.tagSlugs.map((slug) => ({ slug })),
        },
      },
    });
  }
  console.log(`✓ 文章：${posts.length} 篇\n`);

  console.log("🎉 種子資料寫入完成！");
  console.log("⚠️  提醒：上線前請修改 admin@example.com 的密碼");
}

main()
  .catch((e) => {
    console.error("❌ Seed 失敗：", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
