import React from "react";
import type { Metadata } from "next";
import ClientHome from "@/app/ClientHome";
import { getPortfolioData } from "@/lib/portfolioData";
import {
  buildLocaleMetadata,
  buildStructuredDataJsonLd,
  resolveRequestBaseUrl,
  SupportedLocale,
} from "@/lib/seo";

/**
 * Generates localized OpenGraph, canonical, hreflang, and keyword metadata.
 */
export async function generatePortfolioMetadata(
  locale: SupportedLocale,
  canonicalPath: string
): Promise<Metadata> {
  const [baseUrl, data] = await Promise.all([
    resolveRequestBaseUrl(),
    getPortfolioData(),
  ]);
  return buildLocaleMetadata(locale, baseUrl, canonicalPath, data);
}

/**
 * Renders the portfolio UI alongside escaped Schema.org JSON-LD structured data.
 */
export async function PortfolioPageContent({
  locale,
  canonicalPath,
}: {
  locale: SupportedLocale;
  canonicalPath: string;
}) {
  const [baseUrl, data] = await Promise.all([
    resolveRequestBaseUrl(),
    getPortfolioData(),
  ]);

  const jsonLd = buildStructuredDataJsonLd(baseUrl, locale, canonicalPath, data);
  const safeJsonLd = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd }}
      />
      <ClientHome
        projects={data.projects}
        skills={data.skills}
        profile={data.profile}
        photos={data.photos}
        books={data.books}
        education={data.education}
        certifications={data.certifications}
        jobs={data.jobs}
        siteSettings={data.siteSettings}
      />
    </>
  );
}

