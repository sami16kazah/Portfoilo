"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/app/context/LocalContext";
import { BooksSection } from "@/components/portfolio/BooksSection";
import { ContactSection } from "@/components/portfolio/ContactSection";
import { CredentialsGallerySection } from "@/components/portfolio/CredentialsGallerySection";
import { ExperienceSection } from "@/components/portfolio/ExperienceSection";
import { MobileNavSheet } from "@/components/portfolio/MobileNavSheet";
import { OrbitalHero } from "@/components/portfolio/OrbitalHero";
import { PortfolioFooter } from "@/components/portfolio/PortfolioFooter";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { ScrollRuler } from "@/components/portfolio/ScrollRuler";
import { SkillsSection } from "@/components/portfolio/SkillsSection";
import { TopBar } from "@/components/portfolio/TopBar";
import { PORTFOLIO_COPY } from "@/components/portfolio/portfolioCopy";
import "@/components/portfolio/portfolio-theme.css";
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
  const { locale, setLocale } = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [selectedProjectIdx, setSelectedProjectIdx] = useState(0);

  const showExperience = siteSettings?.showExperienceSection !== false;
  const showTelemetry = siteSettings?.showPerformanceTelemetry !== false;
  const showProjects = siteSettings?.showProjectsSection !== false;
  const showSkills = siteSettings?.showSkillsSection !== false;
  const showEducation = siteSettings?.showEducationSection !== false;
  const showBooks = siteSettings?.showBooksSection !== false;
  const showGallery = siteSettings?.showGallerySection !== false;
  const showContact = siteSettings?.showContactSection !== false;

  useEffect(() => {
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr === "light" || attr === "dark") {
      setTheme(attr);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
    try {
      localStorage.setItem("sk-portfolio-theme", theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  const copy = PORTFOLIO_COPY[locale];

  const rulerSections = useMemo(() => {
    const isAr = locale === "ar";
    const fmt = (s: string) => (isAr ? s : s.toUpperCase());
    const list = [{ id: "hero", label: isAr ? "سامي قزح" : "SAMI KAZAH" }];
    if (showExperience && jobs.length > 0) {
      list.push({ id: "experience", label: fmt(copy.nav.experience) });
    }
    if (showProjects && projects.length > 0) {
      list.push({ id: "projects", label: fmt(copy.nav.projects) });
    }
    if (showSkills && skills.length > 0) {
      list.push({ id: "skills", label: fmt(copy.nav.skills) });
    }
    if (showBooks && books.length > 0) {
      list.push({ id: "books", label: fmt(copy.nav.books) });
    }
    if (showEducation || showGallery) {
      list.push({ id: "credentials", label: fmt(copy.nav.education) });
    }
    if (showContact) {
      list.push({ id: "contact", label: fmt(copy.nav.contact) });
    }
    return list;
  }, [
    books.length,
    copy,
    jobs.length,
    locale,
    projects.length,
    showBooks,
    showContact,
    showEducation,
    showExperience,
    showGallery,
    showProjects,
    showSkills,
    skills.length,
  ]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docH > 0 ? y / docH : 0);
      setScrolled(y > 24);

      const heroEl = document.getElementById("hero");
      const heroThreshold = heroEl ? Math.max(260, heroEl.offsetHeight * 0.42) : 340;
      setPastHero(y > heroThreshold);

      const offset = 180;
      let current = "hero";
      for (const sec of rulerSections) {
        const el = document.getElementById(sec.id);
        if (el && el.offsetTop - offset <= y) current = sec.id;
      }
      setActiveSection(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [rulerSections]);

  const handleNavigate = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="sk-app-shell" dir={dir}>
      <div className="sk-top-progress" aria-hidden="true">
        <div
          className="sk-top-progress-bar"
          style={{ transform: `scaleX(${Math.max(0, Math.min(1, scrollProgress))})` }}
        />
      </div>

      <TopBar
        theme={theme}
        locale={locale}
        activeSection={activeSection}
        scrolled={scrolled}
        pastHero={pastHero}
        mobileMenuOpen={mobileMenuOpen}
        profile={profile}
        onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        onChangeLocale={setLocale}
        onToggleMobileMenu={() => setMobileMenuOpen((v) => !v)}
        onNavigate={handleNavigate}
      />

      <MobileNavSheet
        open={mobileMenuOpen}
        locale={locale}
        theme={theme}
        activeSection={activeSection}
        profile={profile}
        projects={projects}
        onClose={() => setMobileMenuOpen(false)}
        onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        onChangeLocale={setLocale}
        onNavigate={handleNavigate}
        onSelectProject={setSelectedProjectIdx}
      />

      <ScrollRuler sections={rulerSections} onNavigate={handleNavigate} rtl={locale === "ar"} />

      <div className="sk-main-frame">
        <main>
          <OrbitalHero locale={locale} profile={profile} onNavigate={handleNavigate} />

          {showExperience && (
            <ExperienceSection locale={locale} jobs={jobs} showTelemetry={showTelemetry} />
          )}

          {showProjects && (
            <ProjectsSection
              locale={locale}
              projects={projects}
              selectedIndex={selectedProjectIdx}
              onSelectIndex={setSelectedProjectIdx}
            />
          )}

          {showSkills && <SkillsSection locale={locale} skills={skills} />}

          {showBooks && <BooksSection locale={locale} books={books} />}

          {(showEducation || showGallery) && (
            <CredentialsGallerySection
              locale={locale}
              education={showEducation ? education : []}
              certifications={showEducation ? certifications : []}
              languages={profile.languages || []}
              photos={showGallery ? photos : []}
            />
          )}

          {showContact && (
            <ContactSection
              locale={locale}
              profile={profile}
              siteSettings={siteSettings}
              apiEndpoint="/api/Email"
            />
          )}
        </main>

        <PortfolioFooter
          locale={locale}
          profile={profile}
          onNavigate={handleNavigate}
          onChangeLocale={setLocale}
        />
      </div>
    </div>
  );
}
