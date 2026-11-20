"use client";

import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Mail,
  Moon,
  Sun,
} from 'lucide-react';
import { FaGithub as Github, FaLinkedin as Linkedin } from 'react-icons/fa';
import {
  PORTFOLIO_COPY,
  getLocalizedText,
  type Locale,
  type ProfileData,
  type ProjectData,
} from './portfolioCopy';

interface MobileNavSheetProps {
  open: boolean;
  locale: Locale;
  theme: 'dark' | 'light';
  activeSection: string;
  profile: ProfileData;
  projects: ProjectData[];
  onClose: () => void;
  onToggleTheme: () => void;
  onChangeLocale: (locale: Locale) => void;
  onNavigate: (id: string) => void;
  onSelectProject: (index: number) => void;
}

export const MobileNavSheet: React.FC<MobileNavSheetProps> = ({
  open,
  locale,
  theme,
  activeSection,
  profile,
  projects,
  onClose,
  onToggleTheme,
  onChangeLocale,
  onNavigate,
  onSelectProject,
}) => {
  const copy = PORTFOLIO_COPY[locale];
  const [projectsOpen, setProjectsOpen] = useState(true);

  const directLinks = [
    { id: 'experience', label: copy.nav.experience },
    { id: 'skills', label: copy.nav.skills },
    { id: 'books', label: copy.nav.books },
    { id: 'credentials', label: copy.nav.education },
    { id: 'contact', label: copy.nav.contact },
  ];

  return (
    <>
      <div
        className={`sk-mobile-backdrop ${open ? 'is-visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        id="sk-mobile-sheet"
        className={`sk-mobile-sheet ${open ? 'is-open' : ''}`}
        aria-label="Mobile Navigation"
        role={open ? 'dialog' : undefined}
        aria-modal={open ? true : undefined}
      >
        <div className="sk-mobile-sheet-scroll">
          {/* Expandable Adobe-Style Featured Projects Accordion */}
          <div className={`sk-mobile-acc-item ${projectsOpen ? 'is-open' : ''}`}>
            <button
              type="button"
              className="sk-mobile-acc-trigger"
              aria-expanded={projectsOpen}
              onClick={() => setProjectsOpen((v) => !v)}
            >
              <span>{copy.nav.projects}</span>
              <ChevronDown size={17} className="sk-mobile-acc-chevron" />
            </button>

            {projectsOpen && (
              <div className="sk-mobile-acc-body">
                {projects.map((proj, idx) => (
                  <button
                    key={proj._id}
                    type="button"
                    className="sk-mobile-proj-row"
                    onClick={() => {
                      onSelectProject(idx);
                      onNavigate('projects');
                      onClose();
                    }}
                  >
                    <span
                      className="sk-mobile-proj-dot"
                      style={{ background: proj.brandColor || 'var(--sk-indigo)' }}
                    />
                    <span className="sk-mobile-proj-copy">
                      <strong>{getLocalizedText(proj, 'title', locale, proj.title)}</strong>
                      <small>{getLocalizedText(proj, 'subtitle', locale, proj.subtitle || '')}</small>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Direct Section Links */}
          <nav className="sk-mobile-links" aria-label="Sections">
            {directLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                className={`sk-mobile-link-row ${activeSection === link.id ? 'is-active' : ''}`}
                onClick={() => {
                  onNavigate(link.id);
                  onClose();
                }}
              >
                <span>{link.label}</span>
                <ArrowRight size={15} />
              </button>
            ))}
          </nav>

          {/* Language Selector Row */}
          <div className="sk-mobile-lang-row">
            {(['en', 'de', 'ar'] as Locale[]).map((loc) => (
              <button
                key={loc}
                type="button"
                className={`sk-mobile-lang-btn ${locale === loc ? 'is-active' : ''}`}
                onClick={() => onChangeLocale(loc)}
              >
                {loc === 'en' ? 'English' : loc === 'de' ? 'Deutsch' : 'العربية'}
              </button>
            ))}
          </div>

          {/* Bottom Utility Actions */}
          <div className="sk-mobile-sheet-foot">
            <div className="sk-mobile-quick-grid">
              {profile.socialLinks?.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sk-mobile-quick-btn"
                >
                  <Github size={15} />
                  <span>GITHUB</span>
                </a>
              )}
              {profile.socialLinks?.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sk-mobile-quick-btn"
                >
                  <Linkedin size={15} />
                  <span>LINKEDIN</span>
                </a>
              )}
            </div>

            <div className="sk-mobile-sheet-actions">
              <button
                type="button"
                className="sk-mobile-theme-btn"
                onClick={onToggleTheme}
              >
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                <span>{theme === 'dark' ? 'LIGHT' : 'DARK'}</span>
              </button>

              <button
                type="button"
                className="sk-mobile-primary-btn"
                onClick={() => {
                  onNavigate('contact');
                  onClose();
                }}
              >
                <Mail size={15} />
                <span>{copy.nav.cta}</span>
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
