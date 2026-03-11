const CACHE_NAME = "sitelab-v1";
const OFFLINE_URL = "/";

// 預快取核心資源
const PRECACHE_URLS = [
  "/",
];

// 安裝
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

// 啟用 — 清除舊快取
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// 攔截請求 — Network First, Cache Fallback
self.addEventListener("fetch", (event) => {
  // 只處理 GET 請求
  if (event.request.method !== "GET") return;

  // 跳過 API 和外部資源
  const url = new URL(event.request.url);
  if (url.pathname.startsWith("/api/")) return;
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 成功取得網路回應，更新快取
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        // 離線時嘗試從快取取得
        return caches.match(event.request).then((cached) => {
          return cached || caches.match(OFFLINE_URL);
        });
      })
  );
});
