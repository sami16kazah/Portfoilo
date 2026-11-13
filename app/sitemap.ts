import type { MetadataRoute } from "next";
import { resolveRequestBaseUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = await resolveRequestBaseUrl();
  const lastModified = new Date();
  const languageAlternates = {
    en: `${baseUrl}/en`,
    de: `${baseUrl}/de`,
    ar: `${baseUrl}/ar`,
    "x-default": baseUrl,
  };

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages: languageAlternates },
    },
    {
      url: `${baseUrl}/en`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: { languages: languageAlternates },
    },
    {
      url: `${baseUrl}/de`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: { languages: languageAlternates },
    },
    {
      url: `${baseUrl}/ar`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.95,
      alternates: { languages: languageAlternates },
    },
  ];
}

