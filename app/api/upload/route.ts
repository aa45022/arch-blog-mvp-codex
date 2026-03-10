import { NextResponse } from "next/server";
import { validateSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = await validateSession();
  if (!auth) return NextResponse.json({ error: "未登入" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "沒有檔案" }, { status: 400 });

    // 檢查檔案類型
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "只支援圖片格式" }, { status: 400 });
    }

    // 檢查檔案大小（5MB 上限）
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "圖片大小不能超過 5MB" }, { status: 400 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      return NextResponse.json({ error: "Cloudinary 未設定" }, { status: 500 });
    }

    // 上傳到 Cloudinary
    const uploadForm = new FormData();
    uploadForm.append("file", file);
    uploadForm.append("upload_preset", uploadPreset);
    uploadForm.append("folder", "arch-blog");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: uploadForm }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.error?.message || "上傳失敗" }, { status: 500 });
    }

    return NextResponse.json({ url: data.secure_url });
  } catch {
    return NextResponse.json({ error: "上傳時發生錯誤" }, { status: 500 });
  }
}
