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
  SiteSettingsData,
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
  siteSettings?: SiteSettingsData;
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
  siteSettings,
}: ClientHomeProps) {
  const { locale } = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  const currentJob = jobs.find((j) => j.isCurrent) || jobs[0];
  const featuredProject = projects.find((p) => p.featured) || projects[0];

  const showExperience = siteSettings?.showExperienceSection !== false;
  const showTelemetry = siteSettings?.showPerformanceTelemetry !== false;
  const showProjects = siteSettings?.showProjectsSection !== false;
  const showSkills = siteSettings?.showSkillsSection !== false;
  const showEducation = siteSettings?.showEducationSection !== false;
  const showBooks = siteSettings?.showBooksSection !== false;
  const showGallery = siteSettings?.showGallerySection !== false;
  const showContact = siteSettings?.showContactSection !== false;

  return (
    <div
      dir={dir}
      className="min-h-screen bg-[#060911] text-slate-50 selection:bg-indigo-500 selection:text-white"
    >
      <Navbar profile={profile} siteSettings={siteSettings} />
      <main>
        <HeroSection
          profile={profile}
          siteSettings={siteSettings}
          currentJob={currentJob}
          featuredProject={featuredProject}
        />
        {showExperience && (
          <ExperiencePerformanceSection jobs={jobs} showTelemetry={showTelemetry} />
        )}
        {showProjects && <ProjectShowcaseSection projects={projects} />}
        {showSkills && <SkillsSection skills={skills} />}
        {showEducation && (
          <CredentialsSection
            education={education}
            certifications={certifications}
          />
        )}
        {showBooks && <BooksShowcaseSection books={books} />}
        <GalleryContactSection
          photos={showGallery ? photos : []}
          profile={profile}
          siteSettings={siteSettings}
          showContact={showContact}
        />
      </main>
    </div>
  );
}
