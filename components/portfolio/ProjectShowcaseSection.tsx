"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  FaExternalLinkAlt,
  FaGithub,
  FaPlayCircle,
  FaUsers,
  FaLayerGroup,
  FaCheckCircle,
  FaVideo,
  FaBookOpen,
  FaFileInvoice,
  FaBalanceScale,
  FaShippingFast,
} from "react-icons/fa";
import { useLocale } from "@/app/context/LocalContext";
import {
  ProjectData,
  getLocalizedList,
  getLocalizedText,
} from "./types";

interface ProjectShowcaseSectionProps {
  projects: ProjectData[];
}

const SHELFORIA_MODULES = [
  {
    id: "inventory",
    title: { en: "Catalog & Desiderata", de: "Bestand & Desiderata", ar: "المخزون والكتالوجات" },
    desc: {
      en: "Precision cataloging for rare books, editions, art, autographs & collector wishlists.",
      de: "Präzise Erfassung für Antiquariat, Erstausgaben, Kunst, Autographen & Suchwünsche.",
      ar: "فهرسة دقيقة للكتب النادرة والطبعات الأولى والتحف الفنية وطلبات المقتنين.",
    },
    badge: "Catalog Engine",
  },
  {
    id: "gobd",
    title: { en: "GoBD & E-Invoicing", de: "GoBD & E-Rechnung", ar: "الفوترة الإلكترونية GoBD" },
    desc: {
      en: "Immutable finalized ledger at DB level plus validated XRechnung (EN 16931) & ZUGFeRD PDFs.",
      de: "Unveränderliche Festschreibung in der Datenbank plus XRechnung (EN 16931) & ZUGFeRD.",
      ar: "سجلات محاسبية غير قابلة للتعديل وفق GoBD مع التحقق من فواتير XRechnung و ZUGFeRD.",
    },
    badge: "GDPdU Ready",
  },
  {
    id: "tax",
    title: { en: "§ 25a UStG & EU-OSS", de: "§ 25a UStG & EU-OSS", ar: "الضرائب التفاضلية و OSS" },
    desc: {
      en: "Per-item margin scheme (§ 25a UStG), EU destination VAT, VIES checks, UStVA & ZM reports.",
      de: "Differenzbesteuerung (§ 25a UStG) je Artikel, EU-OSS, USt-IdNr.-Prüfung, UStVA & ZM.",
      ar: "حساب ضريبة الهامش لكل قطعة مع فحص أرقام الضرائب الأوروبية وتقارير EU-OSS.",
    },
    badge: "Tax Automation",
  },
  {
    id: "marketplaces",
    title: { en: "Marketplaces & DHL", de: "Marktplätze & DHL", ar: "الأسواق وشحن DHL" },
    desc: {
      en: "Synced multi-channel listings with eBay, AbeBooks / ZVAB, Booklooker, DHL labels & PayPal.",
      de: "Synchronisierte Angebote auf eBay, AbeBooks / ZVAB, Booklooker inkl. DHL & PayPal.",
      ar: "مزامنة مباشرة مع eBay و AbeBooks / ZVAB و Booklooker وإصدار ملصقات DHL.",
    },
    badge: "Multi-Channel",
  },
];

export default function ProjectShowcaseSection({
  projects,
}: ProjectShowcaseSectionProps) {
  const { locale, t } = useLocale();
  const prefersReducedMotion = useReducedMotion();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [stageTab, setStageTab] = useState<"preview" | "architecture" | "credits">("preview");
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [activeShelforiaMod, setActiveShelforiaMod] = useState(0);

  const safeProjects = projects || [];
  const activeProject = safeProjects[selectedIndex] || safeProjects[0];

  useEffect(() => {
    setActiveChapterIdx(0);
    setStageTab("preview");
  }, [selectedIndex]);

  if (!activeProject) return null;

  const title = getLocalizedText(activeProject, "title", locale, activeProject.title);
  const subtitle = getLocalizedText(activeProject, "subtitle", locale, activeProject.subtitle || "");
  const paragraphs = getLocalizedList(activeProject, "description", locale);
  const highlights = getLocalizedList(activeProject, "highlights", locale);
  const credits = getLocalizedText(activeProject, "credits", locale, activeProject.credits || "");
  const isShelforia = activeProject.title.toLowerCase().includes("shelforia");

  const chapters = activeProject.videoChapters || [];
  const activeVideoUrl =
    chapters.length > 0
      ? chapters[activeChapterIdx]?.url || activeProject.videoUrl
      : activeProject.videoUrl;

  const modIcons = [FaBookOpen, FaFileInvoice, FaBalanceScale, FaShippingFast];

  return (
    <section id="projects" className="py-24 relative bg-[#060911] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="max-w-3xl mb-10 space-y-3"
        >
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-300">
            <FaLayerGroup aria-hidden="true" /> {t.projects.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.projects.heading}
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            {t.projects.subtitle}
          </p>
        </motion.div>

        {/* Interactive Project Selector Pills */}
        <div
          role="tablist"
          aria-label="Select featured project"
          className="flex flex-wrap gap-3 mb-8"
        >
          {safeProjects.map((proj, idx) => {
            const projTitle = getLocalizedText(proj, "title", locale, proj.title);
            const active = idx === selectedIndex;
            return (
              <button
                key={proj._id || idx}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedIndex(idx)}
                className={`relative px-5 py-3 rounded-2xl text-sm font-bold transition-colors border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                  active
                    ? "text-white border-indigo-400/70"
                    : "bg-[#0D1322] text-slate-300 border-slate-800 hover:border-slate-600 hover:text-white"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="activeProjectPill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-2xl bg-indigo-600/90 -z-0 shadow-lg shadow-indigo-600/25"
                  />
                )}
                <span className="relative z-10 flex items-center gap-2.5">
                  {proj.logoUrl && (
                    <img
                      src={proj.logoUrl}
                      alt=""
                      className="h-5 w-5 rounded object-contain"
                    />
                  )}
                  <span>{projTitle}</span>
                  {proj.date && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-md ${
                        active
                          ? "bg-indigo-950/80 text-indigo-100"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {proj.date}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive Stage */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProject._id || selectedIndex}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.28 }}
            className="rounded-3xl bg-[#0D1322] border border-slate-700/80 overflow-hidden shadow-2xl"
          >
            {/* Browser Frame Chrome */}
            <div className="px-4 sm:px-6 py-3.5 bg-[#080D1A] border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                </div>
                <div className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700/70 text-xs font-mono text-slate-300 truncate max-w-[260px] sm:max-w-sm">
                  {activeProject.demoUrl || `portfolio://projects/${title.toLowerCase().replace(/\s+/g, "-")}`}
                </div>
              </div>

              {/* Stage View Tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { id: "preview", label: t.projects.tabPreview },
                    { id: "architecture", label: t.projects.tabArchitecture },
                    { id: "credits", label: t.projects.tabCredits },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setStageTab(tab.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      stageTab === tab.id
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stage Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Viewport (7 cols) */}
              <div className="lg:col-span-7 p-5 sm:p-7 border-b lg:border-b-0 lg:border-r border-slate-800 bg-[#080C17]">
                {stageTab === "preview" && (
                  <div className="space-y-4">
                    {activeVideoUrl ? (
                      <>
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-700/80 shadow-xl">
                          <video
                            key={activeVideoUrl}
                            src={activeVideoUrl}
                            controls
                            playsInline
                            preload="metadata"
                            className="w-full h-full object-contain bg-black"
                          />
                        </div>
                        {chapters.length > 1 && (
                          <div className="space-y-2">
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              {t.projects.chaptersLabel}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {chapters.map((ch, chIdx) => (
                                <button
                                  key={ch.url}
                                  type="button"
                                  onClick={() => setActiveChapterIdx(chIdx)}
                                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                                    activeChapterIdx === chIdx
                                      ? "bg-indigo-600 text-white border-indigo-400"
                                      : "bg-slate-900 text-slate-300 border-slate-700 hover:text-white"
                                  }`}
                                >
                                  <FaPlayCircle aria-hidden="true" />
                                  <span>{getLocalizedText(ch, "title", locale, ch.title)}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : isShelforia ? (
                      /* Custom Interactive Shelforia Product Explorer + Demo Slot */
                      <div className="space-y-4">
                        <div className="rounded-2xl overflow-hidden border border-emerald-700/60 bg-[#1B332C] shadow-xl">
                          <img
                            src={activeProject.imageUrl || "/assets/projects/shelforia-og.png"}
                            alt="shelforia preview"
                            className="w-full h-auto object-cover"
                          />
                        </div>

                        {/* Interactive Shelforia Module Switcher */}
                        <div className="rounded-2xl bg-[#132620] border border-emerald-700/50 p-4 space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {SHELFORIA_MODULES.map((mod, mIdx) => {
                              const ModIcon = modIcons[mIdx % modIcons.length];
                              const active = activeShelforiaMod === mIdx;
                              return (
                                <button
                                  key={mod.id}
                                  type="button"
                                  onClick={() => setActiveShelforiaMod(mIdx)}
                                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
                                    active
                                      ? "bg-[#E5C17B] text-[#12221D] border-[#E5C17B]"
                                      : "bg-[#0E1E19] text-[#F5EBDD] border-emerald-700/60 hover:border-[#E5C17B]/60"
                                  }`}
                                >
                                  <ModIcon aria-hidden="true" />
                                  <span>{mod.title[locale]}</span>
                                </button>
                              );
                            })}
                          </div>

                          <div className="rounded-xl bg-[#0D1B16] border border-emerald-800/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1">
                              <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#24423A] text-[#E5C17B] text-[11px] font-bold uppercase tracking-wider">
                                {SHELFORIA_MODULES[activeShelforiaMod].badge}
                              </span>
                              <p className="text-sm text-[#F5EBDD] leading-relaxed">
                                {SHELFORIA_MODULES[activeShelforiaMod].desc[locale]}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Ready-to-upload Demo Video Slot */}
                        <div className="rounded-2xl bg-slate-900/90 border border-dashed border-amber-400/50 p-4 flex items-start gap-3.5">
                          <span className="h-10 w-10 rounded-xl bg-amber-950/90 border border-amber-500/40 text-amber-200 flex items-center justify-center shrink-0">
                            <FaVideo aria-hidden="true" />
                          </span>
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-amber-200">
                              {t.projects.demoPendingTitle}
                            </h4>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {t.projects.demoPendingDesc}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : activeProject.imageUrl ? (
                      <div className="rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900">
                        <img
                          src={activeProject.imageUrl}
                          alt={title}
                          className="w-full h-auto max-h-[420px] object-cover"
                        />
                      </div>
                    ) : (
                      /* Architectural card fallback (e.g. TCP-ERP) */
                      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-[#0D162B] to-[#0A101F] border border-slate-700/70 p-6 sm:p-8 min-h-[280px] flex flex-col justify-between">
                        <div className="space-y-3">
                          <span className="inline-block px-3 py-1 rounded-full bg-sky-950 text-sky-200 border border-sky-500/40 text-xs font-bold">
                            {activeProject.date || "Engineering Project"}
                          </span>
                          <h4 className="text-2xl font-extrabold text-white">{title}</h4>
                          <p className="text-slate-300 text-sm sm:text-base">{subtitle}</p>
                        </div>
                        {highlights.length > 0 && (
                          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {highlights.map((item, hIdx) => (
                              <li
                                key={hIdx}
                                className="rounded-xl bg-slate-950/70 border border-slate-800 p-3 text-xs text-slate-200 flex items-start gap-2"
                              >
                                <FaCheckCircle className="text-sky-400 shrink-0 mt-0.5" aria-hidden="true" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {stageTab === "architecture" && (
                  <div className="space-y-5">
                    <h4 className="text-lg font-bold text-white">{t.projects.tabArchitecture}</h4>
                    {highlights.length > 0 ? (
                      <ul className="space-y-3">
                        {highlights.map((item, idx) => (
                          <li
                            key={idx}
                            className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3.5 flex items-start gap-3 text-sm text-slate-200"
                          >
                            <FaCheckCircle className="text-emerald-400 shrink-0 mt-1" aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="space-y-2 text-sm text-slate-300">
                        {paragraphs.map((p, i) => (
                          <p key={i}>{p}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {stageTab === "credits" && (
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <span className="h-10 w-10 rounded-xl bg-indigo-950 border border-indigo-500/40 text-indigo-200 flex items-center justify-center">
                        <FaUsers aria-hidden="true" />
                      </span>
                      <div>
                        <h4 className="text-lg font-bold text-white">{t.projects.tabCredits}</h4>
                        <p className="text-xs text-slate-400">{title}</p>
                      </div>
                    </div>

                    {isShelforia ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="rounded-2xl bg-[#132620] border border-emerald-700/60 p-4">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#E5C17B]">
                            Planning &amp; Full Dev
                          </span>
                          <div className="text-base font-bold text-[#F5EBDD] mt-1">
                            Sami Kazah
                          </div>
                        </div>
                        <div className="rounded-2xl bg-[#132620] border border-emerald-700/60 p-4">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#E5C17B]">
                            Planning &amp; Full Dev
                          </span>
                          <div className="text-base font-bold text-[#F5EBDD] mt-1">
                            Lukas Kowal
                          </div>
                        </div>
                        <div className="rounded-2xl bg-slate-900 border border-slate-700/80 p-4">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                            With the Help Of
                          </span>
                          <div className="text-base font-bold text-white mt-1">
                            Leon Kuck
                          </div>
                        </div>
                      </div>
                    ) : null}

                    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 text-sm text-slate-200 leading-relaxed">
                      {credits || "Developed by Sami Kazah."}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Details Panel (5 cols) */}
              <div className="lg:col-span-5 p-5 sm:p-7 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-extrabold text-white">{title}</h3>
                      {subtitle && (
                        <p className="text-sm font-semibold text-indigo-300 mt-1">{subtitle}</p>
                      )}
                    </div>
                    {activeProject.date && (
                      <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 whitespace-nowrap">
                        {activeProject.date}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                    {paragraphs.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>

                  {credits && (
                    <div className="rounded-2xl bg-[#080D1A] border border-slate-800 p-3.5 text-xs sm:text-sm text-slate-200">
                      <span className="font-bold text-indigo-300 block mb-1">
                        {t.projects.tabCredits}
                      </span>
                      {credits}
                    </div>
                  )}

                  {activeProject.tags && activeProject.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {activeProject.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-xs font-medium text-slate-200"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Links */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-800">
                  {activeProject.demoUrl && (
                    <a
                      href={activeProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
                    >
                      <span>{t.projects.visitSite}</span>
                      <FaExternalLinkAlt size={12} aria-hidden="true" />
                    </a>
                  )}
                  {activeProject.repoUrl && (
                    <a
                      href={activeProject.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100 text-sm font-semibold transition-colors"
                    >
                      <FaGithub aria-hidden="true" />
                      <span>{t.projects.viewCode}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Project Grid Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {safeProjects.map((proj, idx) => {
            const projTitle = getLocalizedText(proj, "title", locale, proj.title);
            const projSubtitle = getLocalizedText(proj, "subtitle", locale, proj.subtitle || "");
            const active = idx === selectedIndex;

            return (
              <motion.button
                key={proj._id || idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                className={`text-left rounded-2xl p-5 border transition-all flex flex-col justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                  active
                    ? "bg-[#121A30] border-indigo-400/70 shadow-lg shadow-indigo-500/10"
                    : "bg-[#0D1322] border-slate-800 hover:border-slate-600"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-base font-bold text-white">{projTitle}</span>
                    {proj.date && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {proj.date}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-2">
                    {projSubtitle || getLocalizedList(proj, "description", locale)[0]}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs font-semibold text-indigo-300">
                  <span>{t.projects.inspectProject}</span>
                  <span>→</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

