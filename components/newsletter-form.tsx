"use client";

import { useState } from "react";
import { Send, Check, Loader2 } from "lucide-react";

/**
 * Newsletter 訂閱表單 — Buttondown
 *
 * 設定步驟：
 * 1. 到 https://buttondown.com 註冊
 * 2. 取得你的 username（在 Settings 頁面）
 * 3. 在 Zeabur 設定環境變數：
 *    - NEXT_PUBLIC_BUTTONDOWN_USERNAME = 你的 username
 */

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const username = process.env.NEXT_PUBLIC_BUTTONDOWN_USERNAME;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");

    try {
      const res = await fetch(`https://api.buttondown.com/v1/subscribers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          tags: ["site-lab"],
        }),
      });

      if (res.ok || res.status === 201) {
        setStatus("success");
        setMessage("訂閱成功！請查收確認信。");
        setEmail("");
      } else {
        // Fallback: 直接用 Buttondown 的表單 action
        const form = document.createElement("form");
        form.method = "POST";
        form.action = `https://buttondown.com/api/emails/embed-subscribe/${username}`;
        form.target = "_blank";
        const input = document.createElement("input");
        input.type = "email";
        input.name = "email";
        input.value = email.trim();
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
        setStatus("success");
        setMessage("已開啟訂閱頁面，請確認。");
        setEmail("");
      }
    } catch {
      // Fallback to form action
      setStatus("error");
      setMessage("訂閱時發生錯誤，請稍後再試。");
    }
  }

  // 未設定 username 時不顯示
  if (!username) return null;

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8">
      <p className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.2em] mb-2 font-display">
        Newsletter
      </p>
      <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-2 font-serif tracking-wide">
        訂閱敷地實驗室
      </h3>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mb-4">
        最新文章直送信箱，不錯過任何學習筆記。
      </p>

      {status === "success" ? (
        <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
          <Check className="w-4 h-4" />
          <span>{message}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-neutral-900 dark:focus:border-neutral-400 transition-colors placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-medium px-5 py-2.5 hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors disabled:opacity-50 uppercase tracking-wider flex items-center gap-2"
          >
            {status === "loading" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            訂閱
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="text-xs text-red-500 mt-2">{message}</p>
      )}

      <p className="text-[10px] text-neutral-300 dark:text-neutral-700 mt-3">
        使用 Buttondown 發送，隨時可取消訂閱。
      </p>
    </div>
  );
}
