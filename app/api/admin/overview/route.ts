import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { PersonalInfo } from "@/models/PersonalInfo";
import { Job } from "@/models/Job";
import { Project } from "@/models/Project";
import { Skill } from "@/models/Skill";
import { Book } from "@/models/Book";
import { Education } from "@/models/Education";
import { Certification } from "@/models/Certification";
import { Photo } from "@/models/Photo";
import { User } from "@/models/User";
import { SiteSettings } from "@/models/SiteSettings";
import {
  AWS_CLOUD_SKILLS,
  DEFAULT_JOBS,
  DEFAULT_PROJECTS,
  mergeProfileWithDefaults,
  mergeSiteSettingsWithDefaults,
} from "@/data/portfolioDefaults";
import { requireAdmin, revalidatePortfolioPaths } from "@/lib/apiUtils";
import { getSecurityDiagnostics } from "@/lib/security";
import { ensureSyncedForAdmin } from "@/lib/syncDefaults";

export async function GET() {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) return adminCheck.response;

  try {
    await connectToDatabase();
    const autoSynced = await ensureSyncedForAdmin();

    const [
      profileDoc,
      siteSettingsDoc,
      jobsList,
      projectsList,
      skillsList,
      booksList,
      educationList,
      certificationsList,
      photosList,
      userCount,
    ] = await Promise.all([
      PersonalInfo.findOne().lean<Record<string, unknown> | null>(),
      SiteSettings.findOne({ key: "main" }).lean<Record<string, unknown> | null>(),
      Job.find()
        .sort({ isCurrent: -1, order: 1, createdAt: -1 })
        .select("_id company role startDate endDate isCurrent location companyUrl logoUrl")
        .lean<{
          _id: unknown;
          company: string;
          role: string;
          startDate?: string;
          endDate?: string;
          isCurrent?: boolean;
          location?: string;
          companyUrl?: string;
          logoUrl?: string;
        }[]>(),
      Project.find()
        .sort({ featured: -1, createdAt: -1 })
        .select("_id title subtitle demoUrl repoUrl featured brandColor logoUrl tags")
        .lean<{
          _id: unknown;
          title: string;
          subtitle?: string;
          demoUrl?: string;
          repoUrl?: string;
          featured?: boolean;
          brandColor?: string;
          logoUrl?: string;
          tags?: string[];
        }[]>(),
      Skill.find()
        .sort({ proficiency: -1 })
        .select("_id name category proficiency icon")
        .lean<{ _id: unknown; name: string; category: string; proficiency?: number; icon?: string }[]>(),
      Book.find()
        .sort({ createdAt: -1 })
        .select("_id title subtitle coverUrl link libraryLinks downloadsLabel topics")
        .lean<{
          _id: unknown;
          title: string;
          subtitle?: string;
          coverUrl?: string;
          link?: string;
          libraryLinks?: { name: string; url: string }[];
          downloadsLabel?: string;
          topics?: string[];
        }[]>(),
      Education.find()
        .sort({ year: -1 })
        .select("_id degree institution year")
        .lean<{ _id: unknown; degree: string; institution: string; year?: string }[]>(),
      Certification.find()
        .sort({ date: -1 })
        .select("_id name issuer date link")
        .lean<{ _id: unknown; name: string; issuer: string; date?: string; link?: string }[]>(),
      Photo.find()
        .sort({ createdAt: -1 })
        .select("_id url title category")
        .lean<{ _id: unknown; url: string; title?: string; category?: string }[]>(),
      User.countDocuments(),
    ]);

    const jobNames = new Set(jobsList.map((j) => j.company.trim().toLowerCase()));
    const projectNames = new Set(projectsList.map((p) => p.title.trim().toLowerCase()));
    const skillNames = new Set(skillsList.map((s) => s.name.trim().toLowerCase()));

    const missingDefaults = {
      profile: profileDoc ? 0 : 1,
      jobs: DEFAULT_JOBS.filter((j) => !jobNames.has(j.company.trim().toLowerCase())).length,
      projects: DEFAULT_PROJECTS.filter((p) => !projectNames.has(p.title.trim().toLowerCase())).length,
      skills:
        skillsList.length === 0
          ? 1
          : AWS_CLOUD_SKILLS.filter((s) => !skillNames.has(s.name.trim().toLowerCase())).length,
      books: booksList.length === 0 ? 1 : 0,
      education: educationList.length === 0 ? 1 : 0,
      certifications: certificationsList.length === 0 ? 1 : 0,
      photos: photosList.length === 0 ? 1 : 0,
    };

    const skillBreakdown = skillsList.reduce<Record<string, number>>((acc, item) => {
      const cat = item.category || "Other";
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      autoSynced: autoSynced ? autoSynced.totalInserted : 0,
      counts: {
        profile: profileDoc ? 1 : 0,
        jobs: jobsList.length,
        projects: projectsList.length,
        skills: skillsList.length,
        books: booksList.length,
        education: educationList.length,
        certifications: certificationsList.length,
        photos: photosList.length,
      },
      missingDefaults,
      profile: mergeProfileWithDefaults(
        profileDoc ? (JSON.parse(JSON.stringify(profileDoc)) as Record<string, unknown>) : null
      ),
      siteSettings: mergeSiteSettingsWithDefaults(
        siteSettingsDoc
          ? (JSON.parse(JSON.stringify(siteSettingsDoc)) as Record<string, unknown>)
          : null
      ),
      skillBreakdown,
      previews: {
        jobs: jobsList.map((j) => ({ ...j, _id: String(j._id) })),
        projects: projectsList.map((p) => ({ ...p, _id: String(p._id) })),
        skills: skillsList.slice(0, 14).map((s) => ({ ...s, _id: String(s._id) })),
        books: booksList.map((b) => ({
          ...b,
          _id: String(b._id),
          libraryCount:
            (b.libraryLinks?.length || 0) > 0 ? b.libraryLinks?.length || 0 : b.link ? 1 : 0,
        })),
        education: educationList.map((e) => ({ ...e, _id: String(e._id) })),
        certifications: certificationsList.map((c) => ({ ...c, _id: String(c._id) })),
        photos: photosList.slice(0, 8).map((p) => ({ ...p, _id: String(p._id) })),
      },
      security: {
        adminEmail: adminCheck.user.email,
        setupLocked: userCount > 0,
        diagnostics: getSecurityDiagnostics(),
      },
    });
  } catch (error) {
    console.error("Failed to load dashboard overview:", error);
    return NextResponse.json({ error: "Failed to load overview" }, { status: 500 });
  }
}

export async function POST() {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) return adminCheck.response;

  revalidatePortfolioPaths();
  return NextResponse.json({
    message: "Live portfolio pages and SEO endpoints revalidated.",
  });
}
