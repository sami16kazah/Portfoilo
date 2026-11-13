import type { Metadata } from "next";
import { headers } from "next/headers";
import { getBookLibraryLinks, getLocalizedList, getLocalizedText } from "@/components/portfolio/types";
import type { PortfolioData } from "@/lib/portfolioData";

export const SUPPORTED_LOCALES = ["en", "de", "ar"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export function isSupportedLocale(value: string): value is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

function normalizeUrl(raw?: string | null): string | null {
  if (!raw) return null;
  const trimmed = raw.trim().replace(/\/+$/, "");
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Resolves the canonical site URL synchronously from deployment environment variables.
 */
export function getEnvBaseUrl(): string {
  return (
    normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL) ||
    normalizeUrl(process.env.SITE_URL) ||
    normalizeUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
    normalizeUrl(process.env.VERCEL_URL) ||
    "http://localhost:3000"
  );
}

/**
 * Resolves the canonical site URL for request-bound dynamic routes (pages, sitemap, llms.txt).
 */
export async function resolveRequestBaseUrl(): Promise<string> {
  const explicit =
    normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL) ||
    normalizeUrl(process.env.SITE_URL) ||
    normalizeUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  if (explicit) return explicit;

  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") || headerStore.get("host");
  if (host) {
    const proto =
      headerStore.get("x-forwarded-proto") ||
      (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
    return `${proto}://${host}`.replace(/\/+$/, "");
  }

  return normalizeUrl(process.env.VERCEL_URL) || "http://localhost:3000";
}

function resolveAbsoluteUrl(baseUrl: string, pathOrUrl?: string): string | undefined {
  if (!pathOrUrl) return undefined;
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  return `${baseUrl}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

function getVerificationMetadata(): Metadata["verification"] | undefined {
  const google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
  const bing = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim();
  const yandex = process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION?.trim();

  if (!google && !bing && !yandex) return undefined;

  return {
    ...(google ? { google } : {}),
    ...(yandex ? { yandex } : {}),
    ...(bing ? { other: { "msvalidate.01": bing } } : {}),
  };
}

const LOCALE_META_CONFIG: Record<
  SupportedLocale,
  {
    ogLocale: string;
    altOgLocales: string[];
    titleSuffix: string;
    descriptionFallback: string;
  }
> = {
  en: {
    ogLocale: "en_US",
    altOgLocales: ["de_DE", "ar_SY"],
    titleSuffix: "Software & Full-Stack Engineer | cloudvibe GmbH & shelforia",
    descriptionFallback:
      "Official portfolio of Sami Kazah (سامي قزح), Software & Full-Stack Engineer at cloudvibe GmbH in Goch, Germany, co-developer of shelforia.de, and published computer science author.",
  },
  de: {
    ogLocale: "de_DE",
    altOgLocales: ["en_US", "ar_SY"],
    titleSuffix: "Software- & Full-Stack-Entwickler | cloudvibe GmbH & shelforia",
    descriptionFallback:
      "Offizielles Portfolio von Sami Kazah (سامي قزح) — Softwareentwickler bei der cloudvibe GmbH in Goch, Mitentwickler von shelforia.de und Fachbuchautor.",
  },
  ar: {
    ogLocale: "ar_SY",
    altOgLocales: ["en_US", "de_DE"],
    titleSuffix: "مهندس برمجيات ومطور متكامل | cloudvibe GmbH و shelforia",
    descriptionFallback:
      "الموقع الرسمي والملف الشخصي للمهندس سامي قزح (Sami Kazah) — مهندس تكنولوجيا معلومات ومطور أنظمة سحابية في ألمانيا لدى cloudvibe GmbH ومشارك في تطوير shelforia.de.",
  },
};

export function buildLocaleMetadata(
  locale: SupportedLocale,
  baseUrl: string,
  canonicalPath: string,
  data: PortfolioData
): Metadata {
  const config = LOCALE_META_CONFIG[locale];
  const primaryName =
    locale === "ar"
      ? `${data.profile.name_ar || "سامي قزح"} (${data.profile.name || "Sami Kazah"})`
      : `${getLocalizedText(data.profile, "name", locale, "Sami Kazah")} (${data.profile.name_ar || "سامي قزح"})`;

  const roleTitle = getLocalizedText(data.profile, "title", locale, config.titleSuffix);
  const bioSummary = getLocalizedList(data.profile, "bio", locale).join(" ");
  const description = (bioSummary || config.descriptionFallback).slice(0, 300);

  const canonicalUrl = `${baseUrl}${canonicalPath === "/" ? "" : canonicalPath}` || baseUrl;
  const ogImageUrl = `${baseUrl}/opengraph-image`;
  const keywords = [
    "Sami Kazah",
    "Sami Qazah",
    "sami16kazah",
    "سامي قزح",
    "المهندس سامي قزح",
    "سامي قزح مهندس برمجيات",
    "ملف أعمال سامي قزح",
    "مطور برمجيات سامي قزح",
    "Sami Kazah Portfolio",
    "Sami Kazah Software Engineer",
    "Sami Kazah Softwareentwickler",
    "Sami Kazah cloudvibe",
    "Sami Kazah Goch",
    "cloudvibe GmbH",
    "shelforia",
    "shelforia.de",
    "Lukas Kowal",
    "Leon Kuck",
    "Damascus University IT Engineer",
    "جامعة دمشق هندسة برمجيات",
    "Design Patterns Arabic Kotobati",
    "ANTLR Arabic Compiler Book",
    "أنماط التصميم باللغة العربية",
    "كتاب المترجمات ANTLR",
    "Next.js",
    "TypeScript",
    "React",
    "AWS Cloud",
    "Amazon Web Services",
    "AWS Cloud Engineer",
    "سحابة AWS",
    "Full-Stack Engineer Germany",
  ];

  const verification = getVerificationMetadata();

  return {
    metadataBase: new URL(baseUrl),
    title: `${primaryName} — ${roleTitle}`,
    description,
    keywords,
    applicationName: "Sami Kazah Portfolio",
    authors: [
      { name: "Sami Kazah", url: baseUrl },
      { name: "سامي قزح", url: `${baseUrl}/ar` },
    ],
    creator: "Sami Kazah (سامي قزح)",
    publisher: "Sami Kazah",
    category: "technology",
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/en`,
        de: `${baseUrl}/de`,
        ar: `${baseUrl}/ar`,
        "x-default": baseUrl,
      },
    },
    openGraph: {
      type: "profile",
      url: canonicalUrl,
      siteName: "Sami Kazah — سامي قزح",
      title: `${primaryName} — ${config.titleSuffix}`,
      description,
      firstName: "Sami",
      lastName: "Kazah",
      username: "sami16kazah",
      locale: config.ogLocale,
      alternateLocale: config.altOgLocales,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "Sami Kazah (سامي قزح) — Software & Full-Stack Engineer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${primaryName} — ${config.titleSuffix}`,
      description,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    ...(verification ? { verification } : {}),
  };
}

/**
 * Generates Schema.org JSON-LD graph tying Sami Kazah's English, German, and Arabic
 * identity, current job, flagship projects, education, and published books together
 * for search engines and AI answer engines.
 */
export function buildStructuredDataJsonLd(
  baseUrl: string,
  locale: SupportedLocale,
  canonicalPath: string,
  data: PortfolioData
) {
  const personId = `${baseUrl}/#person`;
  const websiteId = `${baseUrl}/#website`;
  const pageUrl = `${baseUrl}${canonicalPath === "/" ? "" : canonicalPath}` || baseUrl;
  const currentJob = data.jobs[0];

  const sameAs = Array.from(
    new Set(
      [
        data.profile.socialLinks?.github,
        data.profile.socialLinks?.linkedin,
        data.profile.socialLinks?.twitter,
        data.profile.socialLinks?.instagram,
        "https://cloudvibe.de/",
        "https://shelforia.de/",
        ...data.books.flatMap((b) => getBookLibraryLinks(b).map((l) => l.url)),
      ].filter((url): url is string => Boolean(url && url.startsWith("http")))
    )
  );

  const knowsAbout = Array.from(
    new Set([
      ...data.skills.map((s) => s.name),
      "Software Engineering",
      "Full-Stack Web Development",
      "Cloud ERP Systems",
      "GoBD / XRechnung / ZUGFeRD",
      "AWS Frankfurt",
      "Compiler Construction (ANTLR)",
    ])
  );

  const alumniOf = data.education.map((edu) => ({
    "@type": "EducationalOrganization",
    name: edu.institution,
    alternateName: [edu.institution_ar, edu.institution_de].filter(Boolean),
  }));

  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: baseUrl,
      name: "Sami Kazah (سامي قزح) — Software & Full-Stack Engineer",
      alternateName: ["سامي قزح", "Sami Kazah Portfolio"],
      inLanguage: ["en", "de", "ar"],
      publisher: { "@id": personId },
    },
    {
      "@type": "ProfilePage",
      "@id": `${pageUrl}/#profilepage`,
      url: pageUrl,
      name: getLocalizedText(data.profile, "name", locale, "Sami Kazah"),
      description: getLocalizedList(data.profile, "bio", locale).join(" "),
      inLanguage: locale,
      isPartOf: { "@id": websiteId },
      mainEntity: { "@id": personId },
    },
    {
      "@type": "Person",
      "@id": personId,
      name: data.profile.name || "Sami Kazah",
      givenName: "Sami",
      familyName: "Kazah",
      alternateName: [
        data.profile.name_ar || "سامي قزح",
        "Sami Qazah",
        "sami16kazah",
        "المهندس سامي قزح",
      ],
      url: baseUrl,
      mainEntityOfPage: pageUrl,
      image: resolveAbsoluteUrl(baseUrl, data.profile.avatarUrl || "/assets/images/sami.jpg"),
      email: data.profile.email ? `mailto:${data.profile.email}` : undefined,
      jobTitle: [
        "Software & Full-Stack Engineer",
        "Software- & Full-Stack-Entwickler",
        "مهندس برمجيات ومطور متكامل",
      ],
      description: getLocalizedList(data.profile, "bio", locale).join(" "),
      homeLocation: {
        "@type": "Place",
        name: currentJob?.location || "Goch, Germany",
      },
      worksFor: currentJob
        ? {
            "@type": "Organization",
            name: currentJob.company,
            url: currentJob.companyUrl || "https://cloudvibe.de/",
            logo: resolveAbsoluteUrl(baseUrl, currentJob.logoUrl),
            address: {
              "@type": "PostalAddress",
              addressLocality: "Goch",
              addressCountry: "DE",
            },
          }
        : undefined,
      alumniOf,
      knowsLanguage: [
        { "@type": "Language", name: "Arabic", alternateName: "ar" },
        { "@type": "Language", name: "English", alternateName: "en" },
        { "@type": "Language", name: "German", alternateName: "de" },
      ],
      knowsAbout,
      sameAs,
    },
    ...data.projects.map((proj) => ({
      "@type": "SoftwareApplication",
      name: proj.title,
      alternateName: [proj.title_de, proj.title_ar].filter(Boolean),
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web Browser",
      url: proj.demoUrl || pageUrl,
      image: resolveAbsoluteUrl(baseUrl, proj.imageUrl),
      description: getLocalizedList(proj, "description", locale).join(" "),
      creator: [
        { "@id": personId },
        ...(proj.title.toLowerCase().includes("shelforia")
          ? [{ "@type": "Person", name: "Lukas Kowal" }]
          : []),
      ],
      contributor: proj.title.toLowerCase().includes("shelforia")
        ? [{ "@type": "Person", name: "Leon Kuck" }]
        : undefined,
      keywords: (proj.tags || []).join(", "),
    })),
    ...data.books.map((book) => {
      const libraries = getBookLibraryLinks(book);
      return {
        "@type": "Book",
        name: book.title,
        alternateName: [book.title_ar, book.title_de].filter(Boolean),
        inLanguage: "ar",
        url: libraries[0]?.url || undefined,
        sameAs: libraries.length > 1 ? libraries.map((l) => l.url) : undefined,
        description: getLocalizedText(book, "description", locale, book.description || ""),
        author: { "@id": personId },
      };
    }),
  ];

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

/**
 * Concise markdown summary following llms.txt specification for AI answer engines.
 */
export function buildLlmsSummary(baseUrl: string, data: PortfolioData): string {
  const currentJob = data.jobs[0];
  const projectLines = data.projects
    .map((p) => {
      const url = p.demoUrl ? ` (${p.demoUrl})` : "";
      return `- **${p.title}**${url}: ${p.subtitle || ""} — ${p.credits || "Developed by Sami Kazah"}`;
    })
    .join("\n");

  const bookLines = data.books
    .map((b) => {
      const libraries = getBookLibraryLinks(b);
      const linksText = libraries.length
        ? libraries.map((l) => `[${l.name}](${l.url})`).join(" · ")
        : baseUrl;
      return `- **${b.title} / ${b.title_ar || b.title}** (${linksText}): ${b.description || ""}`;
    })
    .join("\n");

  return `# Sami Kazah (${data.profile.name_ar || "سامي قزح"})

> Official portfolio of Sami Kazah (سامي قزح), Software & Full-Stack Engineer based in Germany at ${currentJob?.company || "cloudvibe GmbH"}, co-developer of shelforia.de, and published computer science author.

## Canonical Multilingual Versions
- [English Portfolio](${baseUrl}/en)
- [Deutsches Portfolio (German)](${baseUrl}/de)
- [الموقع باللغة العربية — سامي قزح (Arabic)](${baseUrl}/ar)
- [Full Knowledge Base for LLMs](${baseUrl}/llms-full.txt)

## Identity & Contact
- Name (EN/DE): ${data.profile.name || "Sami Kazah"} (also searched as Sami Qazah, \`sami16kazah\`)
- Name (AR): ${data.profile.name_ar || "سامي قزح"} (المهندس سامي قزح)
- Current Role: ${currentJob?.role || "Software Engineer"} at [${currentJob?.company || "cloudvibe GmbH"}](${currentJob?.companyUrl || "https://cloudvibe.de/"}) (${currentJob?.location || "Goch, Germany"})
- Email: ${data.profile.email || "samkazah444@gmail.com"}
- GitHub: ${data.profile.socialLinks?.github || "https://github.com/sami16kazah"}
- LinkedIn: ${data.profile.socialLinks?.linkedin || "https://www.linkedin.com/in/sami-kazah-6aa67648/"}
- Languages: ${(data.profile.languages || []).map((l) => `${l.name} (${l.proficiency || ""})`).join(", ")}

## Featured Projects
${projectLines}

## Published Books
${bookLines}
`;
}

/**
 * Full structured trilingual markdown corpus for /llms-full.txt.
 */
export function buildLlmsFullDocument(baseUrl: string, data: PortfolioData): string {
  const skillsList = data.skills.map((s) => `- ${s.name} (${s.category})`).join("\n");
  const eduList = data.education
    .map(
      (e) =>
        `- **${e.degree}** / ${e.degree_de || ""} / ${e.degree_ar || ""} — ${e.institution} (${e.year || ""}): ${e.description || ""}`
    )
    .join("\n");

  const projectsDetailed = data.projects
    .map((p) => {
      const descEn = Array.isArray(p.description) ? p.description.join(" ") : p.description || "";
      const descDe = Array.isArray(p.description_de) ? p.description_de.join(" ") : p.description_de || "";
      const descAr = Array.isArray(p.description_ar) ? p.description_ar.join(" ") : p.description_ar || "";
      return `### ${p.title}${p.title_ar ? ` (${p.title_ar})` : ""}
- URL: ${p.demoUrl || "Internal / Portfolio Case Study"}
- Credits (EN): ${p.credits || "Sami Kazah"}
- Credits (DE): ${p.credits_de || p.credits || "Sami Kazah"}
- Credits (AR): ${p.credits_ar || "سامي قزح"}
- Stack: ${(p.tags || []).join(", ")}
- Summary (EN): ${descEn}
- Zusammenfassung (DE): ${descDe}
- الملخص (AR): ${descAr}`;
    })
    .join("\n\n");

  const jobsDetailed = data.jobs
    .map(
      (j) => `### ${j.company} (${j.companyUrl || ""})
- Role: ${j.role} / ${j.role_de || ""} / ${j.role_ar || ""}
- Location: ${j.location || ""} (${j.startDate || ""} – ${j.endDate || ""})
- Summary (EN): ${j.summary || ""}
- Summary (DE): ${j.summary_de || ""}
- Summary (AR): ${j.summary_ar || ""}
- Highlights: ${(j.highlights || []).join(" | ")}`
    )
    .join("\n\n");

  return `# ${data.profile.name || "Sami Kazah"} — ${data.profile.name_ar || "سامي قزح"} (Full AI Search Profile)

Base URL: ${baseUrl}
Canonical URLs: ${baseUrl}/ | ${baseUrl}/en | ${baseUrl}/de | ${baseUrl}/ar

## Multilingual Bio
### English
${(Array.isArray(data.profile.bio) ? data.profile.bio : [data.profile.bio || ""]).join("\n")}

### Deutsch
${(Array.isArray(data.profile.bio_de) ? data.profile.bio_de : [data.profile.bio_de || ""]).join("\n")}

### العربية
${(Array.isArray(data.profile.bio_ar) ? data.profile.bio_ar : [data.profile.bio_ar || ""]).join("\n")}

## Work Experience
${jobsDetailed}

## Projects
${projectsDetailed}

## Technical Stack
${skillsList}

## Education
${eduList}

## Published Books
${data.books
  .map((b) => {
    const libraries = getBookLibraryLinks(b);
    const linksText = libraries.map((l) => `[${l.name}](${l.url})`).join(" | ");
    return `- **${b.title}** (${b.title_ar || ""} / ${b.title_de || ""})${linksText ? ` — ${linksText}` : ""}: ${b.description || ""} / ${b.description_ar || ""}`;
  })
  .join("\n")}
`;
}

