import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { SiteSettings } from "@/models/SiteSettings";
import {
  DEFAULT_SITE_SETTINGS,
  mergeSiteSettingsWithDefaults,
} from "@/data/portfolioDefaults";
import {
  requireAdmin,
  revalidatePortfolioPaths,
  sanitizeModelInput,
} from "@/lib/apiUtils";
import { SITE_SETTINGS_SANITIZE } from "@/lib/portfolioSchemas";

function cleanStringArray(val: unknown): string[] | undefined {
  if (!Array.isArray(val)) return undefined;
  const cleaned = val
    .map((item) => String(item ?? "").trim())
    .filter(Boolean)
    .slice(0, 12);
  return cleaned;
}

export async function GET() {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) return adminCheck.response;

  try {
    await connectToDatabase();
    const doc = await SiteSettings.findOne({ key: "main" }).lean<Record<string, unknown> | null>();
    return NextResponse.json(mergeSiteSettingsWithDefaults(doc));
  } catch (error) {
    console.error("Failed to fetch site settings:", error);
    return NextResponse.json({ error: "Failed to load site settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) return adminCheck.response;

  try {
    const body = await req.json();
    const sanitized = sanitizeModelInput(body, SITE_SETTINGS_SANITIZE);

    const serviceOptions = cleanStringArray(sanitized.serviceOptions);
    if (serviceOptions !== undefined) {
      sanitized.serviceOptions =
        serviceOptions.length > 0 ? serviceOptions : DEFAULT_SITE_SETTINGS.serviceOptions;
    }

    const budgetOptions = cleanStringArray(sanitized.budgetOptions);
    if (budgetOptions !== undefined) {
      sanitized.budgetOptions =
        budgetOptions.length > 0 ? budgetOptions : DEFAULT_SITE_SETTINGS.budgetOptions;
    }

    await connectToDatabase();
    const updated = await SiteSettings.findOneAndUpdate(
      { key: "main" },
      {
        $set: sanitized,
        $setOnInsert: { key: "main" },
      },
      { upsert: true, new: true, runValidators: true }
    ).lean<Record<string, unknown> | null>();

    revalidatePortfolioPaths();
    return NextResponse.json(mergeSiteSettingsWithDefaults(updated));
  } catch (error) {
    console.error("Failed to update site settings:", error);
    return NextResponse.json({ error: "Failed to save site settings" }, { status: 500 });
  }
}

