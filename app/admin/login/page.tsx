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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-gray-900 mb-1">後台管理</h1>
          <p className="text-sm text-gray-400">建築學習筆記</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">電子郵件</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com" required autoFocus
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent transition-colors" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">密碼</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="請輸入密碼" required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent transition-colors" />
            </div>

            {/* 記住我 */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-accent" />
              <span className="text-xs text-gray-500">記住我（30 天不需重新登入）</span>
            </label>

            {error && <p className="text-xs text-red-500 bg-red-50 rounded px-3 py-2">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-accent text-white text-sm font-medium py-2.5 rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-50">
              {loading ? "登入中..." : "登入"}
            </button>
          </form>
        </div>

        <div className="text-center mt-4">
          <Link href="/" className="text-xs text-gray-400 hover:text-accent transition-colors">
            ← 返回前台
          </Link>
        </div>
      </div>
    </div>
  );
}
