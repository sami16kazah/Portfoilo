import { NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/portfolioData";
import { buildLlmsFullDocument, resolveRequestBaseUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function GET() {
  const [baseUrl, data] = await Promise.all([
    resolveRequestBaseUrl(),
    getPortfolioData(),
  ]);

  return new NextResponse(buildLlmsFullDocument(baseUrl, data), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

