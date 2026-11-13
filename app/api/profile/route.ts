import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { PersonalInfo } from "@/models/PersonalInfo";
import { DEFAULT_PROFILE } from "@/data/portfolioDefaults";
import { requireAdmin, revalidatePortfolioPaths, sanitizeModelInput } from "@/lib/apiUtils";
import { PROFILE_SANITIZE } from "@/lib/portfolioSchemas";
import { sanitizeUrl } from "@/lib/security";

export async function GET() {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) return adminCheck.response;

  try {
    await connectToDatabase();
    const info = await PersonalInfo.findOne().lean();
    if (!info) {
      return NextResponse.json({
        ...DEFAULT_PROFILE,
        _isDefaultSeed: true,
      });
    }
    return NextResponse.json(info);
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) return adminCheck.response;

  try {
    await connectToDatabase();
    const rawBody = await req.json();
    const sanitized = sanitizeModelInput(rawBody, PROFILE_SANITIZE);

    if (sanitized.socialLinks && typeof sanitized.socialLinks === "object" && !Array.isArray(sanitized.socialLinks)) {
      const social = sanitized.socialLinks as Record<string, unknown>;
      sanitized.socialLinks = {
        github: sanitizeUrl(social.github),
        linkedin: sanitizeUrl(social.linkedin),
        twitter: sanitizeUrl(social.twitter),
        instagram: sanitizeUrl(social.instagram),
      };
    }

    const existing = await PersonalInfo.findOne();
    let updated;
    if (existing) {
      updated = await PersonalInfo.findByIdAndUpdate(
        existing._id,
        { $set: sanitized },
        { new: true, runValidators: true }
      );
    } else {
      updated = await PersonalInfo.create(sanitized);
    }

    revalidatePortfolioPaths();
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
