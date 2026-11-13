import connectToDatabase from "@/lib/db";
import { Project } from "@/models/Project";
import { Skill } from "@/models/Skill";
import { PersonalInfo } from "@/models/PersonalInfo";
import { Photo } from "@/models/Photo";
import { Book } from "@/models/Book";
import { Education } from "@/models/Education";
import { Certification } from "@/models/Certification";
import { Job } from "@/models/Job";
import { SiteSettings } from "@/models/SiteSettings";
import { inferLibraryName } from "@/components/portfolio/types";
import {
  AWS_CLOUD_SKILLS,
  CURRENT_DEFAULTS_VERSION,
  DEFAULT_BOOKS,
  DEFAULT_CERTIFICATIONS,
  DEFAULT_EDUCATION,
  DEFAULT_JOBS,
  DEFAULT_PHOTOS,
  DEFAULT_PROFILE,
  DEFAULT_PROJECTS,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_SKILLS,
} from "@/data/portfolioDefaults";
import {
  revalidatePortfolioPaths,
  sanitizeModelInput,
  type SanitizeModelOptions,
} from "@/lib/apiUtils";
import {
  BOOK_SANITIZE,
  CERTIFICATION_SANITIZE,
  EDUCATION_SANITIZE,
  JOB_SANITIZE,
  PHOTO_SANITIZE,
  PROFILE_SANITIZE,
  PROJECT_SANITIZE,
  SKILL_SANITIZE,
} from "@/lib/portfolioSchemas";

function norm(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

async function insertMissingByKey<T extends Record<string, unknown>>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ModelRef: any,
  defaults: T[],
  keyField: keyof T,
  sanitizeOpts: SanitizeModelOptions
): Promise<number> {
  const existing = (await ModelRef.find().select(String(keyField)).lean()) as Record<string, unknown>[];
  const existingKeys = new Set(existing.map((doc) => norm(doc[String(keyField)])));

  const toInsert = defaults
    .filter((item) => !existingKeys.has(norm(item[keyField])))
    .map((item) => sanitizeModelInput(item, sanitizeOpts));

  if (toInsert.length === 0) return 0;
  await ModelRef.insertMany(toInsert);
  return toInsert.length;
}

async function backfillBookLibraryLinks(): Promise<number> {
  const booksMissingLibraries = await Book.find({
    link: { $exists: true, $ne: "" },
    $or: [{ libraryLinks: { $exists: false } }, { libraryLinks: { $size: 0 } }],
  });

  let updated = 0;
  for (const book of booksMissingLibraries) {
    const cleanUrl = String(book.link || "").trim();
    if (!cleanUrl) continue;
    book.libraryLinks = [{ name: inferLibraryName(cleanUrl), url: cleanUrl }];
    await book.save();
    updated += 1;
  }
  return updated;
}

export interface SyncDefaultsResult {
  totalInserted: number;
  backfilledBooks: number;
  inserted: {
    profile: number;
    siteSettings: number;
    jobs: number;
    projects: number;
    skills: number;
    education: number;
    certifications: number;
    books: number;
    photos: number;
  };
}

/**
 * Populates any missing portfolio defaults into MongoDB and stamps the current
 * schema sync version on SiteSettings so intentional admin deletions stay intact.
 */
export async function syncPortfolioDefaults(): Promise<SyncDefaultsResult> {
  await connectToDatabase();

  let profileInserted = 0;
  const existingInfo = await PersonalInfo.findOne().select("_id").lean();
  if (!existingInfo) {
    await PersonalInfo.create(sanitizeModelInput(DEFAULT_PROFILE, PROFILE_SANITIZE));
    profileInserted = 1;
  }

  let siteSettingsInserted = 0;
  const existingSettings = await SiteSettings.findOne({ key: "main" }).select("_id").lean();
  if (!existingSettings) {
    await SiteSettings.create({
      ...DEFAULT_SITE_SETTINGS,
      key: "main",
      defaultsSyncVersion: CURRENT_DEFAULTS_VERSION,
    });
    siteSettingsInserted = 1;
  } else {
    await SiteSettings.updateOne(
      { key: "main" },
      { $set: { defaultsSyncVersion: CURRENT_DEFAULTS_VERSION } }
    );
  }

  const jobsInserted = await insertMissingByKey(Job, DEFAULT_JOBS, "company", JOB_SANITIZE);
  const projectsInserted = await insertMissingByKey(
    Project,
    DEFAULT_PROJECTS,
    "title",
    PROJECT_SANITIZE
  );

  const existingSkillCount = await Skill.countDocuments();
  const skillSource = existingSkillCount === 0 ? DEFAULT_SKILLS : AWS_CLOUD_SKILLS;
  const skillsInserted = await insertMissingByKey(Skill, skillSource, "name", SKILL_SANITIZE);

  const educationInserted = await insertMissingByKey(
    Education,
    DEFAULT_EDUCATION,
    "degree",
    EDUCATION_SANITIZE
  );
  const certificationsInserted = await insertMissingByKey(
    Certification,
    DEFAULT_CERTIFICATIONS,
    "name",
    CERTIFICATION_SANITIZE
  );
  const booksInserted = await insertMissingByKey(Book, DEFAULT_BOOKS, "title", BOOK_SANITIZE);
  const photosInserted = await insertMissingByKey(Photo, DEFAULT_PHOTOS, "url", PHOTO_SANITIZE);

  const backfilledBooks = await backfillBookLibraryLinks();

  const totalInserted =
    profileInserted +
    siteSettingsInserted +
    jobsInserted +
    projectsInserted +
    skillsInserted +
    educationInserted +
    certificationsInserted +
    booksInserted +
    photosInserted;

  if (totalInserted > 0 || backfilledBooks > 0) {
    revalidatePortfolioPaths();
  }

  return {
    totalInserted,
    backfilledBooks,
    inserted: {
      profile: profileInserted,
      siteSettings: siteSettingsInserted,
      jobs: jobsInserted,
      projects: projectsInserted,
      skills: skillsInserted,
      education: educationInserted,
      certifications: certificationsInserted,
      books: booksInserted,
      photos: photosInserted,
    },
  };
}

/**
 * Automatically populates MongoDB with missing portfolio defaults on first admin
 * access (or after new default datasets like AWS Cloud / cloudvibe are introduced),
 * without overwriting or resurrecting items once synced.
 */
export async function ensureSyncedForAdmin(): Promise<SyncDefaultsResult | null> {
  await connectToDatabase();
  const settings = await SiteSettings.findOne({ key: "main" })
    .select("defaultsSyncVersion")
    .lean<{ defaultsSyncVersion?: number } | null>();

  if (settings && (settings.defaultsSyncVersion ?? 0) >= CURRENT_DEFAULTS_VERSION) {
    return null;
  }

  return syncPortfolioDefaults();
}
