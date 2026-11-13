import { Locale } from "@/app/context/LocalContext";

export interface LocalizedLanguage {
  name: string;
  name_de?: string;
  name_ar?: string;
  proficiency?: string;
}

export interface ProfileData {
  name?: string;
  name_de?: string;
  name_ar?: string;
  title?: string;
  title_de?: string;
  title_ar?: string;
  bio?: string[] | string;
  bio_de?: string[] | string;
  bio_ar?: string[] | string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  cvUrl?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  languages?: LocalizedLanguage[];
}

export interface JobMetric {
  label: string;
  label_de?: string;
  label_ar?: string;
  value: string;
  detail?: string;
  detail_de?: string;
  detail_ar?: string;
}

export interface JobData {
  _id: string;
  company: string;
  companyUrl?: string;
  logoUrl?: string;
  role: string;
  role_de?: string;
  role_ar?: string;
  location?: string;
  location_de?: string;
  location_ar?: string;
  employmentType?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  summary?: string;
  summary_de?: string;
  summary_ar?: string;
  highlights?: string[];
  highlights_de?: string[];
  highlights_ar?: string[];
  techStack?: string[];
  performanceMetrics?: JobMetric[];
}

export interface VideoChapter {
  title: string;
  title_de?: string;
  title_ar?: string;
  url: string;
}

export interface ProjectData {
  _id: string;
  title: string;
  title_de?: string;
  title_ar?: string;
  subtitle?: string;
  subtitle_de?: string;
  subtitle_ar?: string;
  description?: string[] | string;
  description_de?: string[] | string;
  description_ar?: string[] | string;
  credits?: string;
  credits_de?: string;
  credits_ar?: string;
  highlights?: string[];
  highlights_de?: string[];
  highlights_ar?: string[];
  tags?: string[];
  repoUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
  videoChapters?: VideoChapter[];
  imageUrl?: string;
  logoUrl?: string;
  brandColor?: string;
  demoStatus?: string;
  featured?: boolean;
  date?: string;
}

export interface SkillData {
  _id: string;
  name: string;
  category: string;
  icon?: string;
  proficiency?: number;
}

export interface EducationData {
  _id: string;
  degree: string;
  degree_de?: string;
  degree_ar?: string;
  institution: string;
  institution_de?: string;
  institution_ar?: string;
  year?: string;
  description?: string;
  description_de?: string;
  description_ar?: string;
}

export interface CertificationData {
  _id: string;
  name: string;
  name_de?: string;
  name_ar?: string;
  issuer: string;
  date?: string;
  link?: string;
}

export interface BookLibraryLink {
  name: string;
  url: string;
}

export interface BookData {
  _id: string;
  title: string;
  title_de?: string;
  title_ar?: string;
  subtitle?: string;
  subtitle_de?: string;
  subtitle_ar?: string;
  coverUrl?: string;
  link?: string;
  libraryLinks?: BookLibraryLink[];
  topics?: string[];
  downloadsLabel?: string;
  description?: string;
  description_de?: string;
  description_ar?: string;
}

/**
 * Infers a readable digital library name from a book's publishing URL.
 */
export function inferLibraryName(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
    if (host.includes("kotobati")) return "Kotobati";
    if (host.includes("noor-book") || host.includes("noorbook")) return "Noor Book";
    if (host.includes("foulabook")) return "Foulabook";
    if (host.includes("ketabpedia")) return "Ketabpedia";
    if (host.includes("books.google")) return "Google Books";
    if (host.includes("amazon")) return "Amazon";
    if (host.includes("archive.org")) return "Internet Archive";
    if (host.includes("github.com")) return "GitHub";
    return host;
  } catch {
    return "External Library";
  }
}

/**
 * Returns deduplicated library links for a book, falling back gracefully to legacy `book.link`.
 */
export function getBookLibraryLinks(book: BookData): BookLibraryLink[] {
  const result: BookLibraryLink[] = [];
  const seen = new Set<string>();

  for (const item of book.libraryLinks || []) {
    const cleanUrl = (item.url || "").trim();
    const cleanName = (item.name || "").trim();
    if (!cleanUrl || seen.has(cleanUrl)) continue;
    seen.add(cleanUrl);
    result.push({
      name: cleanName || inferLibraryName(cleanUrl),
      url: cleanUrl,
    });
  }

  const legacyUrl = (book.link || "").trim();
  if (legacyUrl && !seen.has(legacyUrl)) {
    result.unshift({
      name: inferLibraryName(legacyUrl),
      url: legacyUrl,
    });
  }

  return result;
}

export interface PhotoData {
  _id?: string;
  url: string;
  title?: string;
  category?: string;
}

export function getLocalizedValue<T extends object>(
  item: T | null | undefined,
  field: string,
  locale: Locale
): unknown {
  if (!item) return undefined;
  const record = item as Record<string, unknown>;
  if (locale === "de") {
    const deVal = record[`${field}_de`];
    if (Array.isArray(deVal) ? deVal.length > 0 : Boolean(deVal)) return deVal;
  }
  if (locale === "ar") {
    const arVal = record[`${field}_ar`];
    if (Array.isArray(arVal) ? arVal.length > 0 : Boolean(arVal)) return arVal;
  }
  return record[field];
}

export function getLocalizedText<T extends object>(
  item: T | null | undefined,
  field: string,
  locale: Locale,
  fallback = ""
): string {
  const value = getLocalizedValue(item, field, locale);
  if (Array.isArray(value)) return value.join(" ");
  if (typeof value === "string") return value;
  return fallback;
}

export function getLocalizedList<T extends object>(
  item: T | null | undefined,
  field: string,
  locale: Locale
): string[] {
  const value = getLocalizedValue(item, field, locale);
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

