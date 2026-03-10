"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * 登出按鈕 — Client Component
 */
export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="text-sm text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
    >
      {loading ? "登出中..." : "登出"}
    </button>
  );
}
