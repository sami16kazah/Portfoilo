"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes, FaGlobe } from "react-icons/fa";
import { Locale, useLocale } from "@/app/context/LocalContext";
import { ProfileData, SiteSettingsData, getLocalizedText } from "./types";

interface NavbarProps {
  profile?: ProfileData;
  siteSettings?: SiteSettingsData;
}

export default function Navbar({ profile, siteSettings }: NavbarProps) {
  const { locale, setLocale, t } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [berlinTime, setBerlinTime] = useState("");
  const brandName = getLocalizedText(profile, "name", locale, "Sami Kazah");
  const avatarSrc = profile?.avatarUrl || "/assets/images/sami.jpg";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      try {
        const formatted = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Europe/Berlin",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date());
        setBerlinTime(formatted);
      } catch {
        setBerlinTime("");
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 15000);
    return () => clearInterval(timer);
  }, []);

  const navLinks = [
    siteSettings?.showExperienceSection !== false
      ? { href: "#experience", label: t.nav.experience }
      : null,
    siteSettings?.showProjectsSection !== false
      ? { href: "#projects", label: t.nav.projects }
      : null,
    siteSettings?.showSkillsSection !== false ? { href: "#skills", label: t.nav.skills } : null,
    siteSettings?.showEducationSection !== false
      ? { href: "#education", label: t.nav.education }
      : null,
    siteSettings?.showBooksSection !== false ? { href: "#books", label: t.nav.books } : null,
    siteSettings?.showContactSection !== false
      ? { href: "#contact", label: t.nav.contact }
      : null,
  ].filter(Boolean) as { href: string; label: string }[];

  const locales: Locale[] = ["en", "de", "ar"];

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6 pt-4 pointer-events-none">
      <div
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 pointer-events-auto border ${
          scrolled
            ? "bg-[#0B1120]/90 backdrop-blur-xl border-slate-700/70 shadow-2xl shadow-black/50"
            : "bg-[#0B1120]/65 backdrop-blur-md border-slate-800/70"
        }`}
      >
        <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <a
            href="#top"
            className="flex items-center gap-3 text-slate-50 font-bold tracking-tight text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-lg px-1"
          >
            <img
              src={avatarSrc}
              alt={brandName}
              className="h-9 w-9 rounded-xl object-cover object-top border border-slate-700/80 shrink-0"
            />
            <span className="hidden sm:inline">{brandName}</span>
          </a>

          {/* Desktop links */}
          <nav aria-label="Primary Navigation" className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2.5">
            {berlinTime && (
              <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
                <span>DE {berlinTime}</span>
              </span>
            )}

            {/* 3-way language switcher */}
            <div
              role="group"
              aria-label="Language Selector"
              className="inline-flex items-center p-1 rounded-xl bg-slate-900 border border-slate-700/80"
            >
              <FaGlobe className="text-slate-400 mx-1.5 hidden sm:block text-xs" aria-hidden="true" />
              {locales.map((code) => {
                const active = locale === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLocale(code)}
                    aria-pressed={active}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                      active
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-300 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    {code}
                  </button>
                );
              })}
            </div>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              className="lg:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              {menuOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              aria-label="Mobile Navigation"
              className="lg:hidden border-t border-slate-800 overflow-hidden"
            >
              <div className="px-4 py-3 grid grid-cols-2 gap-2">
                {navLinks.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:text-white bg-slate-900/70 hover:bg-slate-800 transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

