import Script from "next/script";

/**
 * Umami 流量分析
 *
 * 設定步驟：
 * 1. 在 Zeabur 部署 Umami（https://umami.is）
 * 2. 到 Umami 後台新增網站，取得 Website ID
 * 3. 在 Zeabur 設定環境變數：
 *    - NEXT_PUBLIC_UMAMI_URL = 你的 Umami 網址（例如 https://umami.zeabur.app）
 *    - NEXT_PUBLIC_UMAMI_WEBSITE_ID = 你的 Website ID
 */
export default function UmamiAnalytics() {
  const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL;
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  // 未設定時不渲染
  if (!umamiUrl || !websiteId) return null;

  return (
    <Script
      src={`${umamiUrl}/script.js`}
      data-website-id={websiteId}
      strategy="lazyOnload"
    />
  );
}
