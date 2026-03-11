"use client";

import { useEffect } from "react";

/**
 * Service Worker 註冊元件
 * 在 production 環境自動註冊 SW
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch(() => {
          // SW registration failed silently
        });
    }
  }, []);

  return null;
}
