import ClientHome from "./ClientHome";
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

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getData() {
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

    const plainProjects = JSON.parse(JSON.stringify(projects || []));
    const plainSkills = JSON.parse(JSON.stringify(skills || []));
    const plainProfile = JSON.parse(JSON.stringify(profile || null));
    const plainPhotos = JSON.parse(JSON.stringify(photos || []));
    const plainBooks = JSON.parse(JSON.stringify(books || []));
    const plainEducation = JSON.parse(JSON.stringify(education || []));
    const plainCerts = JSON.parse(JSON.stringify(certifications || []));
    const plainJobs = JSON.parse(JSON.stringify(jobs || []));

    return {
      projects: mergeWithDefaults(plainProjects, DEFAULT_PROJECTS, "title"),
      skills: plainSkills.length > 0 ? plainSkills : DEFAULT_SKILLS,
      profile: mergeProfileWithDefaults(plainProfile),
      photos: plainPhotos.length > 0 ? plainPhotos : DEFAULT_PHOTOS,
      books: plainBooks.length > 0 ? plainBooks : DEFAULT_BOOKS,
      education: plainEducation.length > 0 ? plainEducation : DEFAULT_EDUCATION,
      certifications:
        plainCerts.length > 0 ? plainCerts : DEFAULT_CERTIFICATIONS,
      jobs: mergeWithDefaults(plainJobs, DEFAULT_JOBS, "company"),
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
}

export default async function Home() {
  const data = await getData();

  return (
    <ClientHome
      projects={data.projects}
      skills={data.skills}
      profile={data.profile}
      photos={data.photos}
      books={data.books}
      education={data.education}
      certifications={data.certifications}
      jobs={data.jobs}
    />
  );
}
