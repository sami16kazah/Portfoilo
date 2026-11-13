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
  FaBuilding,
  FaGlobe,
} from "react-icons/fa";
import { useLocale } from "@/app/context/LocalContext";
import {
  ProfileData,
  getLocalizedList,
  getLocalizedText,
} from "./types";

interface HeroSectionProps {
  profile: ProfileData;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  const { locale, t } = useLocale();
  const prefersReducedMotion = useReducedMotion();

  const displayName = getLocalizedText(profile, "name", locale, "Sami Kazah");
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
      className="relative min-h-[92vh] flex items-center pt-28 pb-16 overflow-hidden bg-grid-pattern"
    >
      {/* Subtle GPU-friendly ambient radial lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[520px] rounded-full bg-indigo-600/20 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 w-[520px] h-[420px] rounded-full bg-emerald-500/10 blur-[130px]"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Current job status pill */}
            <a
              href="#experience"
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-sm font-medium hover:border-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              <FaBuilding className="text-emerald-300 text-xs" aria-hidden="true" />
              <span>{t.hero.badge}</span>
            </a>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                {displayName}
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

          {/* Right Portrait & Company Bento Card */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-sm">
              <div
                aria-hidden="true"
                className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-indigo-500/40 via-cyan-400/20 to-emerald-400/40 blur-xl opacity-70"
              />
              <div className="relative rounded-3xl bg-[#0D1322] border border-slate-700/80 p-4 shadow-2xl">
                <div className="relative aspect-[4/4.3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
                  <img
                    src={profile.avatarUrl || "/assets/images/sami.jpg"}
                    alt={displayName}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0D1322] via-[#0D1322]/70 to-transparent" />
                </div>

                {/* Integrated CloudVibe + Shelforia quick badges */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <a
                    href="https://cloudvibe.de/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-[#070B14] border border-slate-800 hover:border-cyan-400/50 p-3 flex flex-col justify-between transition-colors"
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Company
                    </span>
                    <img
                      src="/assets/companies/cloudvibe-logo.webp"
                      alt="cloudvibe GmbH"
                      className="h-8 w-auto object-contain object-left mt-1.5"
                    />
                  </a>

                  <a
                    href="https://shelforia.de/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-[#162B25] border border-emerald-700/60 hover:border-amber-300/60 p-3 flex flex-col justify-between transition-colors"
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-200/90">
                      Flagship ERP
                    </span>
                    <div className="flex items-center gap-2 mt-1.5">
                      <img
                        src="/assets/projects/shelforia-logo.svg"
                        alt="shelforia"
                        className="h-7 w-7 rounded-md shrink-0"
                      />
                      <span className="text-sm font-bold text-[#F5EBDD] truncate">
                        shelforia.de
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

