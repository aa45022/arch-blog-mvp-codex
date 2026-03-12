"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminSetupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [setupKey, setSetupKey] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, setupKey }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "建立失敗");
        setLoading(false);
        return;
      }

      const mode = data?.mode;
      if (mode === "reset") {
        setSuccess("密碼重設成功，將跳轉到登入頁...");
      } else {
        setSuccess("管理員建立成功，將跳轉到登入頁...");
      }
      setTimeout(() => router.push("/admin/login"), 900);
    } catch {
      setError("網路錯誤，請稍後再試");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4">
      <div className="w-full max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6">
        <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-1">初始化管理員</h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-5">
          若系統尚未有管理員，這裡會建立第一組帳號；若已有管理員，請輸入既有 Email + ADMIN_SETUP_KEY 來重設密碼。
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1">密碼（至少 8 碼）</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1">初始化金鑰（可留空）</label>
            <input
              type="text"
              value={setupKey}
              onChange={(e) => setSetupKey(e.target.value)}
              className="w-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-sm"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
          {success && <p className="text-xs text-green-600">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs py-2.5 uppercase tracking-wider disabled:opacity-50"
          >
            {loading ? "建立中..." : "建立管理員"}
          </button>
        </form>

        <div className="text-center mt-5">
          <Link href="/admin/login" className="text-xs text-neutral-500 hover:text-neutral-900">
            ← 回登入頁
          </Link>
        </div>
      </div>
    </div>
  );
}
