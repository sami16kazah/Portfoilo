"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaEnvelope,
  FaFileDownload,
  FaArrowDown,
  FaGlobe,
} from "react-icons/fa";
import { useLocale } from "@/app/context/LocalContext";
import {
  JobData,
  ProfileData,
  ProjectData,
  SiteSettingsData,
  getLocalizedList,
  getLocalizedText,
} from "./types";

interface HeroSectionProps {
  profile: ProfileData;
  siteSettings?: SiteSettingsData;
  currentJob?: JobData;
  featuredProject?: ProjectData;
}

export default function HeroSection({
  profile,
  siteSettings,
  currentJob,
  featuredProject,
}: HeroSectionProps) {
  const { locale, t } = useLocale();
  const prefersReducedMotion = useReducedMotion();

  const companyLabel = siteSettings?.featuredCompanyLabel || "Company";
  const companyHref = currentJob?.companyUrl || "https://cloudvibe.de/";
  const companyLogo = currentJob?.logoUrl || "/assets/companies/cloudvibe-logo.webp";
  const companyName = currentJob?.company || "cloudvibe GmbH";
  const flagshipLabel = siteSettings?.featuredProjectLabel || "Flagship ERP";
  const projectHref = featuredProject?.demoUrl || "https://shelforia.de/";
  const projectLogo = featuredProject?.logoUrl || "/assets/projects/shelforia-logo.svg";
  const projectTitle =
    getLocalizedText(featuredProject, "title", locale, "") || "shelforia.de";

  const displayName = getLocalizedText(profile, "name", locale, "Sami Kazah");
  const alternateScriptName =
    locale === "ar"
      ? profile.name || "Sami Kazah"
      : profile.name_ar || "سامي قزح";
  const displayTitle = getLocalizedText(
    profile,
    "title",
    locale,
    "Software & Full-Stack Engineer"
  );
  const bioParagraphs = getLocalizedList(profile, "bio", locale);
  const languages = profile.languages || [];

  const socialItems = [
    {
      label: "GitHub",
      href: profile.socialLinks?.github,
      icon: <FaGithub size={19} />,
    },
    {
      label: "LinkedIn",
      href: profile.socialLinks?.linkedin,
      icon: <FaLinkedin size={19} />,
    },
    {
      label: "Twitter",
      href: profile.socialLinks?.twitter,
      icon: <FaTwitter size={19} />,
    },
    {
      label: "Instagram",
      href: profile.socialLinks?.instagram,
      icon: <FaInstagram size={19} />,
    },
    {
      label: "Email",
      href: `mailto:${profile.email || "samkazah444@gmail.com"}`,
      icon: <FaEnvelope size={19} />,
    },
  ].filter((item) => Boolean(item.href));

  return (
    <section
      id="top"
      className="relative min-h-[88vh] flex items-center pt-28 pb-16 overflow-hidden bg-grid-pattern"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span>{displayName}</span>
                {alternateScriptName && alternateScriptName !== displayName && (
                  <span
                    lang={locale === "ar" ? "en" : "ar"}
                    dir={locale === "ar" ? "ltr" : "rtl"}
                    className="text-2xl sm:text-3xl font-semibold text-slate-300"
                  >
                    {alternateScriptName}
                  </span>
                )}
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-indigo-300">
                {displayTitle}
              </p>
            </div>

            <div className="space-y-3 max-w-2xl">
              {bioParagraphs.map((paragraph, idx) => (
                <p key={idx} className="text-slate-300 text-base sm:text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Spoken Languages */}
            {languages.length > 0 && (
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FaGlobe aria-hidden="true" /> {t.hero.languagesLabel}:
                </span>
                {languages.map((lang, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-slate-200 font-medium"
                  >
                    <span>{getLocalizedText(lang, "name", locale, lang.name)}</span>
                    {lang.proficiency && (
                      <span className="px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-200 border border-indigo-500/30 text-xs font-bold">
                        {lang.proficiency}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            )}

            {/* Primary CTAs + Socials */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
              >
                <span>{t.hero.viewWork}</span>
                <FaArrowDown className="text-xs" aria-hidden="true" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 font-semibold transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <FaEnvelope aria-hidden="true" />
                <span>{t.hero.contactMe}</span>
              </a>

              {profile.cvUrl && (
                <a
                  href={profile.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-950/90 hover:bg-emerald-900 text-emerald-200 border border-emerald-500/40 font-semibold transition-all"
                >
                  <FaFileDownload aria-hidden="true" />
                  <span>{t.hero.resume}</span>
                </a>
              )}
            </div>

            {/* Social Links Row */}
            <div className="flex items-center gap-3 pt-2">
              {socialItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href?.startsWith("mailto:") ? undefined : "_blank"}
                  rel={item.href?.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  aria-label={item.label}
                  title={item.label}
                  className="h-11 w-11 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200 hover:text-white hover:border-indigo-400 hover:bg-slate-800 flex items-center justify-center transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right Portrait & Company Card */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-sm">
              <div className="relative rounded-3xl bg-[#0D1322] border border-slate-800 p-4 shadow-2xl">
                <div className="relative aspect-[4/4.3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
                  <img
                    src={profile.avatarUrl || "/assets/images/sami.jpg"}
                    alt={displayName}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0D1322] via-[#0D1322]/70 to-transparent" />
                </div>

                {/* Integrated Company + Flagship Project quick badges */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <a
                    href={companyHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-[#070B14] border border-slate-800 hover:border-cyan-400/50 p-3 flex flex-col justify-between transition-colors"
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {companyLabel}
                    </span>
                    {companyLogo ? (
                      <img
                        src={companyLogo}
                        alt={companyName}
                        className="h-8 w-auto object-contain object-left mt-1.5"
                      />
                    ) : (
                      <span className="text-sm font-bold text-white mt-1.5 truncate">
                        {companyName}
                      </span>
                    )}
                  </a>

                  <a
                    href={projectHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-[#162B25] border border-emerald-700/60 hover:border-amber-300/60 p-3 flex flex-col justify-between transition-colors"
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-200/90 truncate">
                      {flagshipLabel}
                    </span>
                    <div className="flex items-center gap-2 mt-1.5">
                      {projectLogo && (
                        <img
                          src={projectLogo}
                          alt={projectTitle}
                          className="h-7 w-7 rounded-md shrink-0 object-contain"
                        />
                      )}
                      <span className="text-sm font-bold text-[#F5EBDD] truncate">
                        {projectTitle}
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

