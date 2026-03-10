import { NextResponse } from "next/server";
import { validateSession, checkOrigin } from "@/lib/auth";
import crypto from "crypto";

/**
 * POST /api/upload/sign — 產生 Cloudinary 上傳簽章
 *
 * 固定參數：folder / resource_type=image / overwrite=false
 * 前端拿到簽章後直接上傳到 Cloudinary（direct upload）
 */
export async function POST(request: Request) {
  const auth = await validateSession();
  if (!auth) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  if (!checkOrigin(request)) {
    return NextResponse.json({ error: "來源不允許" }, { status: 403 });
  }

  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary 設定不完整" },
        { status: 500 }
      );
    }

    const timestamp = Math.round(Date.now() / 1000);

    // 🎨 可改：上傳資料夾名稱
    const folder = "arch-blog";

    // 固定簽章參數 — 限制上傳範圍
    const paramsToSign = [
      `folder=${folder}`,
      `overwrite=false`,
      `resource_type=image`,
      `timestamp=${timestamp}`,
    ].join("&");

    // SHA-1 簽章
    const signature = crypto
      .createHash("sha1")
      .update(paramsToSign + apiSecret)
      .digest("hex");

    return NextResponse.json({
      data: {
        signature,
        timestamp,
        cloudName,
        apiKey,
        folder,
      },
    });
  } catch {
    return NextResponse.json({ error: "產生簽章失敗" }, { status: 500 });
  }
}
