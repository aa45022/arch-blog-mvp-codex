import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const adminCount = await prisma.adminUser.count();
    return NextResponse.json({ data: { needsSetup: adminCount === 0 } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "無法檢查管理員狀態";
    // 避免前端反覆出現 500 導致登入頁體驗中斷，回 200 並附帶錯誤訊息
    return NextResponse.json({ data: { needsSetup: false }, error: message });
  }
}
