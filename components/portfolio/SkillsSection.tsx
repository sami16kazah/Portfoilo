"use client";

import React, { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaCode } from "react-icons/fa";
import { useLocale } from "@/app/context/LocalContext";
import { SkillData, getLocalizedText } from "./types";

interface SkillsSectionProps {
  skills: SkillData[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const { locale, t } = useLocale();
  const prefersReducedMotion = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(skills.map((s) => s.category || "Other")));
    return ["All", ...unique];
  }, [skills]);

  const filtered = useMemo(() => {
    if (selectedCategory === "All") return skills;
    return skills.filter((s) => (s.category || "Other") === selectedCategory);
  }, [skills, selectedCategory]);

  if (!skills || skills.length === 0) return null;

  return (
    <section id="skills" className="py-24 bg-[#070B14] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.skills.heading}
          </h2>

          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter skills by category">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                    active
                      ? "bg-emerald-800 text-white border-emerald-400"
                      : "bg-[#0D1322] text-slate-300 border-slate-800 hover:border-slate-600 hover:text-white"
                  }`}
                >
                  {cat === "All" ? t.skills.all : cat}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {filtered.map((skill, idx) => {
            const label = getLocalizedText(skill, "name", locale, skill.name);

            return (
              <motion.div
                key={skill._id || idx}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.25, delay: (idx % 6) * 0.03 }}
                className="rounded-2xl bg-[#0D1322] border border-slate-800 hover:border-slate-600 p-4 flex items-center gap-3.5 transition-colors"
              >
                <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-700/70 flex items-center justify-center shrink-0 p-1.5">
                  {skill.icon ? (
                    <img
                      src={skill.icon}
                      alt={label}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <FaCode className="text-slate-300" aria-hidden="true" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">{label}</div>
                  <div className="text-xs text-slate-400">{skill.category}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
