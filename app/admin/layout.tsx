/**
 * Admin Layout — 最外層容器（不含 Header，Header 在 dashboard/layout 裡）
 * 用途：包裹 login + dashboard，login 不需要導覽列
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col">
      {children}
    </div>
  );
}
