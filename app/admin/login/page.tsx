"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });
      const data = await res.json();

      if (!res.ok) { setError(data.error || "登入失敗"); setLoading(false); return; }
      router.push("/admin/posts");
    } catch {
      setError("網路錯誤，請稍後再試");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
      <div className="w-full max-w-sm mx-auto p-6">
        <div className="text-center mb-10">
          <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight mb-1">SITE LAB</h1>
          <p className="text-[10px] text-neutral-400 dark:text-neutral-500 tracking-[0.2em]">敷地實驗室 — 後台管理</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase tracking-wider">電子郵件</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com" required autoFocus
                className="w-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:focus:border-neutral-400 transition-colors" />
            </div>

            <div>
              <label className="block text-[10px] font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase tracking-wider">密碼</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="請輸入密碼" required
                className="w-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:focus:border-neutral-400 transition-colors" />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-neutral-900 dark:accent-neutral-200" />
              <span className="text-xs text-neutral-500 dark:text-neutral-400">記住我（30 天不需重新登入）</span>
            </label>

            {error && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-medium py-2.5 hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors disabled:opacity-50 uppercase tracking-wider">
              {loading ? "登入中..." : "登入"}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
            ← 返回前台
          </Link>
        </div>
      </div>
    </div>
  );
}
