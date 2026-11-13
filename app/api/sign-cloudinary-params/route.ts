import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/auth";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;
    if (!apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary is not configured." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { paramsToSign } = body;

    const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);
    return Response.json({ signature });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to sign Cloudinary parameters" },
      { status: 500 }
    );
  }
}
