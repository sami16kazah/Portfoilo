import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { requireAdmin } from "@/lib/apiUtils";

const ALLOWED_SIGN_KEYS = new Set([
  "timestamp",
  "folder",
  "public_id",
  "source",
  "upload_preset",
  "eager",
  "transformation",
  "tags",
  "context",
  "invalidate",
  "unique_filename",
  "use_filename",
]);

function getCloudinarySecret(): string | undefined {
  return process.env.CLOUDINARY_API_SECRET || process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;
}

export async function POST(request: Request) {
  try {
    const adminCheck = await requireAdmin();
    if (!adminCheck.ok) return adminCheck.response;

    const apiSecret = getCloudinarySecret();
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

    if (!apiSecret || !cloudName || !apiKey) {
      return NextResponse.json(
        { error: "Cloudinary is not configured." },
        { status: 500 }
      );
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    const body = await request.json();
    const rawParams = body?.paramsToSign;
    if (!rawParams || typeof rawParams !== "object" || Array.isArray(rawParams)) {
      return NextResponse.json({ error: "Invalid paramsToSign payload." }, { status: 400 });
    }

    const filteredParams: Record<string, string | number | boolean> = {};
    for (const [key, value] of Object.entries(rawParams as Record<string, unknown>)) {
      if (!ALLOWED_SIGN_KEYS.has(key)) continue;
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        filteredParams[key] = value;
      }
    }

    if (!filteredParams.timestamp) {
      return NextResponse.json({ error: "Missing timestamp." }, { status: 400 });
    }

    const signature = cloudinary.utils.api_sign_request(filteredParams, apiSecret);
    return NextResponse.json({ signature });
  } catch (error) {
    console.error("Cloudinary sign error:", error);
    return NextResponse.json(
      { error: "Failed to sign Cloudinary parameters" },
      { status: 500 }
    );
  }
}
