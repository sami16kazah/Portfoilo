import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiUtils";
import { syncPortfolioDefaults } from "@/lib/syncDefaults";

export async function GET() {
  return NextResponse.json(
    { error: "Method Not Allowed. Trigger sync via POST /api/migrate from Admin Dashboard." },
    { status: 405 }
  );
}

export async function POST() {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) return adminCheck.response;

  try {
    const result = await syncPortfolioDefaults();

    return NextResponse.json({
      message:
        result.totalInserted > 0 || result.backfilledBooks > 0
          ? `Synced ${result.totalInserted} missing item(s)${
              result.backfilledBooks > 0
                ? ` and upgraded ${result.backfilledBooks} book library link(s)`
                : ""
            } to MongoDB.`
          : "All portfolio defaults are already stored in MongoDB.",
      ...result,
    });
  } catch (error) {
    console.error("Sync defaults error:", error);
    return NextResponse.json({ error: "Failed to sync portfolio defaults" }, { status: 500 });
  }
}
