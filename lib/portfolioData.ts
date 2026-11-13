import { cache } from "react";
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
  DEFAULT_BOOKS,
  DEFAULT_CERTIFICATIONS,
  DEFAULT_EDUCATION,
  DEFAULT_JOBS,
  DEFAULT_PHOTOS,
  DEFAULT_PROFILE,
  DEFAULT_PROJECTS,
  DEFAULT_SKILLS,
  mergeProfileWithDefaults,
  mergeWithDefaults,
} from "@/data/portfolioDefaults";
import type {
  BookData,
  CertificationData,
  EducationData,
  JobData,
  PhotoData,
  ProfileData,
  ProjectData,
  SkillData,
} from "@/components/portfolio/types";

export interface PortfolioData {
  projects: ProjectData[];
  skills: SkillData[];
  profile: ProfileData;
  photos: PhotoData[];
  books: BookData[];
  education: EducationData[];
  certifications: CertificationData[];
  jobs: JobData[];
}

/**
 * Loads portfolio content from MongoDB and merges missing defaults so the site
 * and crawler endpoints remain populated even without a database connection.
 */
export const getPortfolioData = cache(async (): Promise<PortfolioData> => {
  try {
    await connectToDatabase();
    const [
      projects,
      skills,
      profile,
      photos,
      books,
      education,
      certifications,
      jobs,
    ] = await Promise.all([
      Project.find().sort({ createdAt: -1 }).lean(),
      Skill.find().sort({ proficiency: -1 }).lean(),
      PersonalInfo.findOne().lean(),
      Photo.find().sort({ createdAt: -1 }).lean(),
      Book.find().sort({ createdAt: -1 }).lean(),
      Education.find().sort({ year: -1 }).lean(),
      Certification.find().sort({ date: -1 }).lean(),
      Job.find().sort({ isCurrent: -1, order: 1, createdAt: -1 }).lean(),
    ]);

    const plainProjects = JSON.parse(JSON.stringify(projects || [])) as ProjectData[];
    const plainSkills = JSON.parse(JSON.stringify(skills || [])) as SkillData[];
    const plainProfile = JSON.parse(JSON.stringify(profile || null)) as Record<string, unknown> | null;
    const plainPhotos = JSON.parse(JSON.stringify(photos || [])) as PhotoData[];
    const plainBooks = JSON.parse(JSON.stringify(books || [])) as BookData[];
    const plainEducation = JSON.parse(JSON.stringify(education || [])) as EducationData[];
    const plainCerts = JSON.parse(JSON.stringify(certifications || [])) as CertificationData[];
    const plainJobs = JSON.parse(JSON.stringify(jobs || [])) as JobData[];

    return {
      projects: mergeWithDefaults(
        plainProjects as unknown as Record<string, unknown>[],
        DEFAULT_PROJECTS as unknown as Record<string, unknown>[],
        "title"
      ) as unknown as ProjectData[],
      skills: plainSkills.length > 0 ? plainSkills : DEFAULT_SKILLS,
      profile: mergeProfileWithDefaults(plainProfile) as ProfileData,
      photos: plainPhotos.length > 0 ? plainPhotos : DEFAULT_PHOTOS,
      books: plainBooks.length > 0 ? plainBooks : DEFAULT_BOOKS,
      education: plainEducation.length > 0 ? plainEducation : DEFAULT_EDUCATION,
      certifications: plainCerts.length > 0 ? plainCerts : DEFAULT_CERTIFICATIONS,
      jobs: mergeWithDefaults(
        plainJobs as unknown as Record<string, unknown>[],
        DEFAULT_JOBS as unknown as Record<string, unknown>[],
        "company"
      ) as unknown as JobData[],
    };
  } catch (error) {
    console.warn("Using static portfolio defaults (database unavailable):", error);
    return {
      projects: DEFAULT_PROJECTS,
      skills: DEFAULT_SKILLS,
      profile: DEFAULT_PROFILE,
      photos: DEFAULT_PHOTOS,
      books: DEFAULT_BOOKS,
      education: DEFAULT_EDUCATION,
      certifications: DEFAULT_CERTIFICATIONS,
      jobs: DEFAULT_JOBS,
    };
  }
});
