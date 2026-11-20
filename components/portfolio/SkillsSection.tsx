"use client";

import React, { useMemo, useState } from 'react';
import {
  Activity,
  Cloud,
  Code2,
  Cpu,
  Database,
  HardDrive,
  Lock,
  Server,
} from 'lucide-react';
import {
  PORTFOLIO_COPY,
  getLocalizedText,
  resolveAssetUrl,
  type Locale,
  type SkillData,
} from './portfolioCopy';
import { SectionHeader } from './SectionHeader';

interface SkillsSectionProps {
  locale: Locale;
  skills: SkillData[];
}

function renderCloudIcon(iconName?: string) {
  switch (iconName) {
    case 'SiAmazonec2':
      return <Server size={20} style={{ color: '#f59e0b' }} />;
    case 'SiAmazons3':
      return <HardDrive size={20} style={{ color: '#10b981' }} />;
    case 'SiAmazonrds':
      return <Database size={20} style={{ color: '#38bdf8' }} />;
    case 'SiAwslambda':
      return <Cpu size={20} style={{ color: '#fbbf24' }} />;
    case 'SiAmazoniam':
      return <Lock size={20} style={{ color: '#f43f5e' }} />;
    case 'SiAmazoncloudwatch':
      return <Activity size={20} style={{ color: '#ec4899' }} />;
    case 'SiAmazonwebservices':
    case 'FaAws':
      return <Cloud size={20} style={{ color: '#f59e0b' }} />;
    default:
      return <Code2 size={18} style={{ color: 'var(--sk-indigo)' }} />;
  }
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ locale, skills }) => {
  const copy = PORTFOLIO_COPY[locale];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    const unique = Array.from(new Set(skills.map((s) => s.category || 'Other')));
    return ['All', ...unique];
  }, [skills]);

  const filtered = useMemo(() => {
    if (selectedCategory === 'All') return skills;
    return skills.filter((s) => (s.category || 'Other') === selectedCategory);
  }, [skills, selectedCategory]);

  if (!skills || skills.length === 0) return null;

  return (
    <section id="skills" className="sk-section">
      <div className="sk-container">
        <SectionHeader
          code={copy.sections.skills.code}
          label={copy.sections.skills.label}
          meta={copy.sections.skills.meta}
        />

        <div className="sk-skills-head">
          <div>
            <h2 className="sk-display-h2">
              {copy.skills.heading}{' '}
              <span className="sk-brand-highlight">{copy.skills.headingAccent}</span>
            </h2>
            <p className="sk-lead">{copy.skills.subtitle}</p>
          </div>

          <div className="sk-filter-row" role="tablist" aria-label="Filter skills">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              const label = cat === 'All' ? copy.skills.all : copy.skills.categories[cat] || cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`sk-filter-btn ${active ? 'is-active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="sk-skills-grid">
          {filtered.map((skill) => {
            const label = getLocalizedText(skill, 'name', locale, skill.name);
            const cat = skill.category || 'Other';
            const catLabel = copy.skills.categories[cat] || cat;
            const isImg = Boolean(
              skill.icon &&
                (skill.icon.startsWith('/') ||
                  skill.icon.startsWith('./') ||
                  skill.icon.startsWith('http'))
            );
            const prof = Math.min(100, Math.max(20, skill.proficiency || 82));

            return (
              <div key={skill._id} className="sk-skill-card">
                <div className="sk-skill-icon-box">
                  {isImg ? (
                    <img src={resolveAssetUrl(skill.icon)} alt={label} />
                  ) : (
                    renderCloudIcon(skill.icon)
                  )}
                </div>
                <div className="sk-skill-info">
                  <div className="sk-skill-top">
                    <strong>{label}</strong>
                    <span className="sk-skill-cat">{catLabel}</span>
                  </div>
                  <div className="sk-skill-meter" aria-hidden="true">
                    <span className="sk-skill-meter-fill" style={{ width: `${prof}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
