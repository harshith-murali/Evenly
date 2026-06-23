import crypto from "node:crypto";
import { NextResponse } from "next/server";

export async function POST() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      {
        error: "Cloudinary is not fully configured.",
        missing: {
          cloudName: !cloudName,
          apiKey: !apiKey,
          apiSecret: !apiSecret
        }
      },
      { status: 400 }
    );
  }

  const folder = "evenly/receipts";
  const timestamp = Math.round(Date.now() / 1000);
  const signatureBase = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(signatureBase).digest("hex");

  return NextResponse.json({
    apiKey,
    cloudName,
    folder,
    signature,
    timestamp
  });
}
