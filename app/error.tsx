"use client";

/**
 * 全站錯誤邊界
 * 捕捉 Runtime 錯誤，不外洩原始錯誤訊息
 */
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-lg font-bold text-gray-900 mb-2">發生錯誤</h2>
        <p className="text-sm text-gray-500 mb-4">很抱歉，頁面載入時發生問題。</p>
        <button
          onClick={reset}
          className="text-sm bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dark transition-colors"
        >
          重試
        </button>
      </div>
    </div>
  );
}
