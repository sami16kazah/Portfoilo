"use client";

import React from "react";
import { useLocale } from "@/app/context/LocalContext";
import Navbar from "@/components/portfolio/Navbar";
import HeroSection from "@/components/portfolio/HeroSection";
import ExperiencePerformanceSection from "@/components/portfolio/ExperiencePerformanceSection";
import ProjectShowcaseSection from "@/components/portfolio/ProjectShowcaseSection";
import SkillsSection from "@/components/portfolio/SkillsSection";
import CredentialsSection from "@/components/portfolio/CredentialsSection";
import BooksShowcaseSection from "@/components/portfolio/BooksShowcaseSection";
import GalleryContactSection from "@/components/portfolio/GalleryContactSection";
import {
  BookData,
  CertificationData,
  EducationData,
  JobData,
  PhotoData,
  ProfileData,
  ProjectData,
  SkillData,
} from "@/components/portfolio/types";

interface ClientHomeProps {
  projects: ProjectData[];
  skills: SkillData[];
  profile: ProfileData;
  photos: PhotoData[];
  books: BookData[];
  education: EducationData[];
  certifications: CertificationData[];
  jobs: JobData[];
}

export default function ClientHome({
  projects,
  skills,
  profile,
  photos,
  books,
  education,
  certifications,
  jobs,
}: ClientHomeProps) {
  const { locale } = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div
      dir={dir}
      className="min-h-screen bg-[#060911] text-slate-50 selection:bg-indigo-500 selection:text-white"
    >
      <Navbar />
      <main>
        <HeroSection profile={profile} />
        <ExperiencePerformanceSection jobs={jobs} />
        <ProjectShowcaseSection projects={projects} />
        <SkillsSection skills={skills} />
        <CredentialsSection
          education={education}
          certifications={certifications}
        />
        <BooksShowcaseSection books={books} />
        <GalleryContactSection photos={photos} profile={profile} />
      </main>
    </div>
  );
}
