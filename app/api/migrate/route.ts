import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Project } from "@/models/Project";
import { Skill } from "@/models/Skill";
import { PersonalInfo } from "@/models/PersonalInfo";
import { Photo } from "@/models/Photo";
import { Book } from "@/models/Book";
import { Education } from "@/models/Education";
import { Certification } from "@/models/Certification";
import { Job } from "@/models/Job";
import {
  AWS_CLOUD_SKILLS,
  DEFAULT_BOOKS,
  DEFAULT_CERTIFICATIONS,
  DEFAULT_EDUCATION,
  DEFAULT_JOBS,
  DEFAULT_PHOTOS,
  DEFAULT_PROFILE,
  DEFAULT_PROJECTS,
  DEFAULT_SKILLS,
} from "@/data/portfolioDefaults";
import {
  requireAdmin,
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
    await connectToDatabase();

    let profileInserted = 0;
    const existingInfo = await PersonalInfo.findOne().select("_id").lean();
    if (!existingInfo) {
      await PersonalInfo.create(sanitizeModelInput(DEFAULT_PROFILE, PROFILE_SANITIZE));
      profileInserted = 1;
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

    revalidatePortfolioPaths();

    const totalInserted =
      profileInserted +
      jobsInserted +
      projectsInserted +
      skillsInserted +
      educationInserted +
      certificationsInserted +
      booksInserted +
      photosInserted;

    return NextResponse.json({
      message:
        totalInserted > 0
          ? `Synced ${totalInserted} missing item(s) to MongoDB.`
          : "All portfolio defaults are already stored in MongoDB.",
      inserted: {
        profile: profileInserted,
        jobs: jobsInserted,
        projects: projectsInserted,
        skills: skillsInserted,
        education: educationInserted,
        certifications: certificationsInserted,
        books: booksInserted,
        photos: photosInserted,
      },
    });
  } catch (error) {
    console.error("Sync defaults error:", error);
    return NextResponse.json({ error: "Failed to sync portfolio defaults" }, { status: 500 });
  }
}
