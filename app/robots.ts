import type { MetadataRoute } from "next";
import { resolveRequestBaseUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = await resolveRequestBaseUrl();
  const disallow = ["/admin", "/admin/", "/api/", "/setup"];
  const allow = ["/", "/en", "/de", "/ar", "/llms.txt", "/llms-full.txt"];

  return {
    rules: [
      { userAgent: "*", allow, disallow },
      { userAgent: "Googlebot", allow, disallow },
      { userAgent: "Google-Extended", allow, disallow },
      { userAgent: "Bingbot", allow, disallow },
      { userAgent: "OAI-SearchBot", allow, disallow },
      { userAgent: "ChatGPT-User", allow, disallow },
      { userAgent: "GPTBot", allow, disallow },
      { userAgent: "PerplexityBot", allow, disallow },
      { userAgent: "ClaudeBot", allow, disallow },
      { userAgent: "Claude-Web", allow, disallow },
      { userAgent: "anthropic-ai", allow, disallow },
      { userAgent: "Applebot", allow, disallow },
      { userAgent: "Applebot-Extended", allow, disallow },
      { userAgent: "DuckAssistBot", allow, disallow },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
