import ClientHome from "./ClientHome";
import connectToDatabase from "@/lib/db";
import { Project } from "@/models/Project";
import { Skill } from "@/models/Skill";
import { PersonalInfo } from "@/models/PersonalInfo";
import { Photo } from "@/models/Photo";
import { Book } from "@/models/Book";
import { Education } from "@/models/Education";
import { Certification } from "@/models/Certification";

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable caching completely

async function getData() {
  await connectToDatabase();
  const [projects, skills, profile, photos, books, education, certifications] = await Promise.all([
    Project.find().sort({ createdAt: -1 }),
    Skill.find().sort({ proficiency: -1 }),
    PersonalInfo.findOne(),
    Photo.find().sort({ createdAt: -1 }),
    Book.find().sort({ createdAt: -1 }),
    Education.find().sort({ year: -1 }),
    Certification.find().sort({ date: -1 }),
  ]);

  return {
    projects: JSON.parse(JSON.stringify(projects)),
    skills: JSON.parse(JSON.stringify(skills)),
    profile: JSON.parse(JSON.stringify(profile)),
    photos: JSON.parse(JSON.stringify(photos)),
    books: JSON.parse(JSON.stringify(books)),
    education: JSON.parse(JSON.stringify(education)),
    certifications: JSON.parse(JSON.stringify(certifications)),
  };
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
    />
  );
}
