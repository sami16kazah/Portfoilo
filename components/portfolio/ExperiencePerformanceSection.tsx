"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  FaExternalLinkAlt,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaBolt,
  FaServer,
  FaShieldAlt,
  FaCloud,
} from "react-icons/fa";
import { useLocale } from "@/app/context/LocalContext";
import { JobData, getLocalizedList, getLocalizedText } from "./types";

interface ExperiencePerformanceSectionProps {
  jobs: JobData[];
  showTelemetry?: boolean;
}

interface TelemetryState {
  fps: number;
  ttfbMs: number | null;
  domReadyMs: number | null;
  fcpMs: number | null;
}

export default function ExperiencePerformanceSection({
  jobs,
  showTelemetry = true,
}: ExperiencePerformanceSectionProps) {
  const { locale, t } = useLocale();
  const prefersReducedMotion = useReducedMotion();
  const [perfTab, setPerfTab] = useState<"telemetry" | "pipeline">("telemetry");
  const [telemetry, setTelemetry] = useState<TelemetryState>({
    fps: 60,
    ttfbMs: null,
    domReadyMs: null,
    fcpMs: null,
  });

  // Measure real client-side performance metrics via the browser Performance API
  useEffect(() => {
    const readNavMetrics = () => {
      try {
        const nav = performance.getEntriesByType("navigation")[0] as
          | PerformanceNavigationTiming
          | undefined;
        const paintEntries = performance.getEntriesByType("paint");
        const fcp = paintEntries.find((e) => e.name === "first-contentful-paint");

        setTelemetry((prev) => ({
          ...prev,
          ttfbMs: nav ? Math.max(1, Math.round(nav.responseStart - nav.requestStart)) : null,
          domReadyMs: nav
            ? Math.max(1, Math.round(nav.domContentLoadedEventEnd - nav.startTime))
            : null,
          fcpMs: fcp ? Math.max(1, Math.round(fcp.startTime)) : null,
        }));
      } catch {
        // Fallback silently if Performance API is restricted
      }
    };

    const timer = setTimeout(readNavMetrics, 400);

    // Lightweight live FPS sampler when telemetry tab is active
    let frameCount = 0;
    let lastTime = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      frameCount += 1;
      const elapsed = now - lastTime;
      if (elapsed >= 1000) {
        const currentFps = Math.min(120, Math.round((frameCount * 1000) / elapsed));
        setTelemetry((prev) => ({ ...prev, fps: currentFps }));
        frameCount = 0;
        lastTime = now;
      }
      rafId = requestAnimationFrame(tick);
    };

    if (!prefersReducedMotion) {
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      clearTimeout(timer);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [prefersReducedMotion]);

  if (!jobs || jobs.length === 0) return null;

  const fpsPercentage = Math.min(100, Math.round((telemetry.fps / 60) * 100));
  const ringCircumference = 2 * Math.PI * 38;
  const ringDashOffset =
    ringCircumference - (fpsPercentage / 100) * ringCircumference;

  return (
    <section id="experience" className="py-24 relative bg-[#070B14] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mb-12 space-y-2.5"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.jobs.heading}
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            {t.jobs.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Jobs Timeline / Current Role Cards */}
          <div className={`${showTelemetry ? "lg:col-span-7" : "lg:col-span-12"} space-y-6`}>
            {jobs.map((job, idx) => {
              const role = getLocalizedText(job, "role", locale, job.role);
              const location = getLocalizedText(job, "location", locale, job.location || "");
              const summary = getLocalizedText(job, "summary", locale, job.summary || "");
              const highlights = getLocalizedList(job, "highlights", locale);
              const metrics = job.performanceMetrics || [];

              return (
                <motion.article
                  key={job._id || idx}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: idx * 0.08 }}
                  className="rounded-3xl bg-[#0D1322] border border-slate-700/80 p-6 sm:p-8 shadow-xl hover:border-cyan-400/50 transition-colors"
                >
                  {/* Top Bar: Company Logo + Current Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
                    <div className="flex items-center gap-4">
                      {job.logoUrl ? (
                        <div className="rounded-2xl bg-[#060A14] border border-slate-700/80 px-4 py-2.5 flex items-center justify-center shadow-inner">
                          <img
                            src={job.logoUrl}
                            alt={`${job.company} logo`}
                            className="h-11 w-auto max-w-[160px] object-contain"
                          />
                        </div>
                      ) : (
                        <div className="h-14 w-14 rounded-2xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-200 font-bold text-xl">
                          {job.company.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-bold text-white">{job.company}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300 mt-1">
                          {location && (
                            <span className="inline-flex items-center gap-1.5">
                              <FaMapMarkerAlt className="text-cyan-400 text-xs" aria-hidden="true" />
                              {location}
                            </span>
                          )}
                          {(job.startDate || job.endDate) && (
                            <span className="text-slate-400">
                              {job.startDate} — {job.isCurrent ? (locale === "de" ? "Heute" : locale === "ar" ? "حتى الآن" : "Present") : job.endDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {job.isCurrent && (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-600/50 text-emerald-200 text-xs font-bold">
                          {t.jobs.currentBadge}
                        </span>
                      )}
                      {job.companyUrl && (
                        <a
                          href={job.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                        >
                          <span>{t.jobs.visitCompany}</span>
                          <FaExternalLinkAlt size={10} aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Role & Summary */}
                  <div className="pt-6 space-y-4">
                    <h4 className="text-lg sm:text-xl font-bold text-cyan-300">{role}</h4>
                    {summary && (
                      <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                        {summary}
                      </p>
                    )}

                    {/* Architectural Highlights */}
                    {metrics.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        {metrics.map((m, mIdx) => (
                          <div
                            key={mIdx}
                            className="rounded-2xl bg-[#080D1A] border border-slate-800 p-3.5"
                          >
                            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                              {getLocalizedText(m, "label", locale, m.label)}
                            </div>
                            <div className="text-sm font-bold text-white mt-1">
                              {m.value}
                            </div>
                            {m.detail && (
                              <div className="text-xs text-slate-300 mt-0.5">
                                {getLocalizedText(m, "detail", locale, m.detail)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Responsibilities List */}
                    {highlights.length > 0 && (
                      <div className="pt-3 space-y-2.5">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          {t.jobs.highlightsTitle}
                        </div>
                        <ul className="space-y-2">
                          {highlights.map((item, hIdx) => (
                            <li key={hIdx} className="flex items-start gap-2.5 text-sm text-slate-200 leading-relaxed">
                              <FaCheckCircle
                                className="text-emerald-400 shrink-0 mt-1 text-xs"
                                aria-hidden="true"
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tech Stack Tags */}
                    {job.techStack && job.techStack.length > 0 && (
                      <div className="pt-3">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                          {t.jobs.stackTitle}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {job.techStack.map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-xs font-medium text-slate-200"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* Right Column: Creative Performance Studio */}
          {showTelemetry && (
          <motion.aside
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="lg:col-span-5 rounded-3xl bg-[#0D1322] border border-slate-700/80 p-6 shadow-xl sticky top-24"
          >
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="h-9 w-9 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center">
                  <FaBolt aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">{t.jobs.perfTitle}</h3>
                  <p className="text-xs text-slate-400">{t.jobs.measureNote}</p>
                </div>
              </div>
            </div>

            {/* Interactive Mode Tabs */}
            <div
              role="tablist"
              aria-label="Performance view mode"
              className="mt-4 grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#070B14] border border-slate-800"
            >
              <button
                type="button"
                role="tab"
                aria-selected={perfTab === "telemetry"}
                onClick={() => setPerfTab("telemetry")}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                  perfTab === "telemetry"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                {t.jobs.tabTelemetry}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={perfTab === "pipeline"}
                onClick={() => setPerfTab("pipeline")}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                  perfTab === "pipeline"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                {t.jobs.tabPipeline}
              </button>
            </div>

            {perfTab === "telemetry" ? (
              <div className="mt-5 space-y-4">
                {/* Live FPS Gauge */}
                <div className="rounded-2xl bg-[#080D1A] border border-slate-800 p-4 flex items-center gap-5">
                  <div className="relative w-24 h-24 shrink-0">
                    <svg viewBox="0 0 96 96" className="w-full h-full -rotate-90" aria-hidden="true">
                      <circle
                        cx="48"
                        cy="48"
                        r="38"
                        fill="none"
                        stroke="#1E293B"
                        strokeWidth="8"
                      />
                      <motion.circle
                        cx="48"
                        cy="48"
                        r="38"
                        fill="none"
                        stroke="#34D399"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={ringCircumference}
                        animate={{ strokeDashoffset: ringDashOffset }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-extrabold text-white tabular-nums">
                        {telemetry.fps}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-emerald-300">
                        FPS
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 min-w-0">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {t.jobs.fpsLabel}
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {t.jobs.motionActive}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {t.jobs.measureNote}
                    </p>
                  </div>
                </div>

                {/* Live Browser Timing Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-[#080D1A] border border-slate-800 p-3.5">
                    <div className="text-[11px] font-semibold text-slate-400">
                      {t.jobs.ttfbLabel}
                    </div>
                    <div className="text-lg font-extrabold text-cyan-300 mt-1 tabular-nums">
                      {telemetry.ttfbMs !== null ? `${telemetry.ttfbMs} ms` : "—"}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-[#080D1A] border border-slate-800 p-3.5">
                    <div className="text-[11px] font-semibold text-slate-400">
                      {t.jobs.fcpLabel}
                    </div>
                    <div className="text-lg font-extrabold text-emerald-300 mt-1 tabular-nums">
                      {telemetry.fcpMs !== null ? `${telemetry.fcpMs} ms` : "—"}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-[#080D1A] border border-slate-800 p-3.5">
                    <div className="text-[11px] font-semibold text-slate-400">
                      {t.jobs.domLabel}
                    </div>
                    <div className="text-lg font-extrabold text-indigo-300 mt-1 tabular-nums">
                      {telemetry.domReadyMs !== null ? `${telemetry.domReadyMs} ms` : "—"}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {t.jobs.pipelineSteps.map((step, sIdx) => {
                  const icons = [FaBolt, FaServer, FaCloud, FaShieldAlt];
                  const Icon = icons[sIdx % icons.length];
                  return (
                    <motion.div
                      key={sIdx}
                      initial={prefersReducedMotion ? false : { opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: sIdx * 0.06 }}
                      className="rounded-2xl bg-[#080D1A] border border-slate-800 hover:border-slate-700 p-3.5 flex items-center gap-3.5 transition-colors"
                    >
                      <span className="h-9 w-9 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 flex items-center justify-center shrink-0">
                        <Icon size={14} aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white">{step.title}</div>
                        <div className="text-xs text-slate-300">{step.detail}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.aside>
          )}
        </div>
      </div>
    </section>
  );
}

