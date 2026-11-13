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
import {
  AWS_CLOUD_SKILLS,
  DEFAULT_JOBS,
  DEFAULT_PROJECTS,
} from "@/data/portfolioDefaults";
import { requireAdmin, revalidatePortfolioPaths } from "@/lib/apiUtils";
import { getSecurityDiagnostics } from "@/lib/security";

export async function GET() {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) return adminCheck.response;

  try {
    await connectToDatabase();

    const [
      hasProfile,
      jobsList,
      projectsList,
      skillsList,
      booksCount,
      educationCount,
      certificationsCount,
      photosCount,
      userCount,
    ] = await Promise.all([
      PersonalInfo.countDocuments(),
      Job.find().select("company").lean<{ company: string }[]>(),
      Project.find().select("title").lean<{ title: string }[]>(),
      Skill.find().select("name").lean<{ name: string }[]>(),
      Book.countDocuments(),
      Education.countDocuments(),
      Certification.countDocuments(),
      Photo.countDocuments(),
      User.countDocuments(),
    ]);

    const jobNames = new Set(jobsList.map((j) => j.company.trim().toLowerCase()));
    const projectNames = new Set(projectsList.map((p) => p.title.trim().toLowerCase()));
    const skillNames = new Set(skillsList.map((s) => s.name.trim().toLowerCase()));

    const missingDefaults = {
      profile: hasProfile === 0 ? 1 : 0,
      jobs: DEFAULT_JOBS.filter((j) => !jobNames.has(j.company.trim().toLowerCase())).length,
      projects: DEFAULT_PROJECTS.filter((p) => !projectNames.has(p.title.trim().toLowerCase())).length,
      skills:
        skillsList.length === 0
          ? 1
          : AWS_CLOUD_SKILLS.filter((s) => !skillNames.has(s.name.trim().toLowerCase())).length,
      books: booksCount === 0 ? 1 : 0,
      education: educationCount === 0 ? 1 : 0,
      certifications: certificationsCount === 0 ? 1 : 0,
      photos: photosCount === 0 ? 1 : 0,
    };

    return NextResponse.json({
      counts: {
        profile: hasProfile,
        jobs: jobsList.length,
        projects: projectsList.length,
        skills: skillsList.length,
        books: booksCount,
        education: educationCount,
        certifications: certificationsCount,
        photos: photosCount,
      },
      missingDefaults,
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
