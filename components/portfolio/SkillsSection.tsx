"use client";

import React, { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { IconType } from "react-icons";
import {
  FaAws,
  FaCloud,
  FaCode,
  FaDatabase,
  FaServer,
  FaShieldAlt,
} from "react-icons/fa";
import {
  SiAmazonapigateway,
  SiAmazoncloudwatch,
  SiAmazondynamodb,
  SiAmazonec2,
  SiAmazonecs,
  SiAmazoniam,
  SiAmazonrds,
  SiAmazonroute53,
  SiAmazons3,
  SiAmazonwebservices,
  SiAwsfargate,
  SiAwslambda,
} from "react-icons/si";
import { useLocale } from "@/app/context/LocalContext";
import { SkillData, getLocalizedText } from "./types";

interface SkillsSectionProps {
  skills: SkillData[];
}

const SKILL_ICON_MAP: Record<string, { Icon: IconType; colorClass: string }> = {
  FaAws: { Icon: FaAws, colorClass: "text-[#FF9900]" },
  FaCloud: { Icon: FaCloud, colorClass: "text-cyan-400" },
  FaServer: { Icon: FaServer, colorClass: "text-slate-300" },
  FaDatabase: { Icon: FaDatabase, colorClass: "text-sky-400" },
  FaShieldAlt: { Icon: FaShieldAlt, colorClass: "text-rose-400" },
  SiAmazonwebservices: { Icon: SiAmazonwebservices, colorClass: "text-[#FF9900]" },
  SiAmazonec2: { Icon: SiAmazonec2, colorClass: "text-[#FF9900]" },
  SiAmazons3: { Icon: SiAmazons3, colorClass: "text-emerald-400" },
  SiAmazonrds: { Icon: SiAmazonrds, colorClass: "text-sky-400" },
  SiAwslambda: { Icon: SiAwslambda, colorClass: "text-amber-400" },
  SiAmazoniam: { Icon: SiAmazoniam, colorClass: "text-rose-400" },
  SiAmazoncloudwatch: { Icon: SiAmazoncloudwatch, colorClass: "text-pink-400" },
  SiAmazonroute53: { Icon: SiAmazonroute53, colorClass: "text-violet-400" },
  SiAmazonapigateway: { Icon: SiAmazonapigateway, colorClass: "text-fuchsia-400" },
  SiAmazondynamodb: { Icon: SiAmazondynamodb, colorClass: "text-blue-400" },
  SiAmazonecs: { Icon: SiAmazonecs, colorClass: "text-orange-400" },
  SiAwsfargate: { Icon: SiAwsfargate, colorClass: "text-orange-300" },
};

function isImagePath(icon?: string): boolean {
  if (!icon) return false;
  return icon.startsWith("/") || icon.startsWith("http://") || icon.startsWith("https://") || icon.startsWith("data:");
}

function SkillIconBadge({
  icon,
  category,
  label,
}: {
  icon?: string;
  category?: string;
  label: string;
}) {
  if (isImagePath(icon)) {
    return (
      <img
        src={icon}
        alt={label}
        className="w-full h-full object-contain"
      />
    );
  }

  const mapped = icon ? SKILL_ICON_MAP[icon] : undefined;
  if (mapped) {
    const { Icon, colorClass } = mapped;
    return <Icon className={`w-6 h-6 ${colorClass}`} aria-hidden="true" />;
  }

  if ((category || "").toLowerCase() === "cloud") {
    return <FaAws className="w-6 h-6 text-[#FF9900]" aria-hidden="true" />;
  }

  return <FaCode className="w-5 h-5 text-slate-300" aria-hidden="true" />;
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
              const categoryLabel =
                cat === "All"
                  ? t.skills.all
                  : t.skills.categories?.[cat] || cat;
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
                  {categoryLabel}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {filtered.map((skill, idx) => {
            const label = getLocalizedText(skill, "name", locale, skill.name);
            const cat = skill.category || "Other";
            const catLabel = t.skills.categories?.[cat] || cat;

            return (
              <motion.div
                key={skill._id || skill.name || idx}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.25, delay: (idx % 6) * 0.03 }}
                className="rounded-2xl bg-[#0D1322] border border-slate-800 hover:border-slate-600 p-4 flex items-center gap-3.5 transition-colors"
              >
                <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-700/70 flex items-center justify-center shrink-0 p-1.5">
                  <SkillIconBadge icon={skill.icon} category={cat} label={label} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">{label}</div>
                  <div className="text-xs text-slate-400 truncate">{catLabel}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
