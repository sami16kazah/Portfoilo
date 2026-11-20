"use client";

import React, { useState } from 'react';
import {
  ArrowUp,
  ArrowUpRight,
  ChevronDown,
  Mail,
} from 'lucide-react';
import { FaGithub as Github, FaLinkedin as Linkedin } from 'react-icons/fa';
import {
  PORTFOLIO_COPY,
  getLocalizedText,
  type Locale,
  type ProfileData,
} from './portfolioCopy';
import { SamiBrandLogo } from './SamiBrandLogo';

interface PortfolioFooterProps {
  locale: Locale;
  profile: ProfileData;
  onNavigate: (id: string) => void;
  onChangeLocale: (locale: Locale) => void;
}

const CORE_STRIP = [
  'TypeScript',
  'Next.js',
  'React',
  'AWS Frankfurt',
  'PostgreSQL',
  'Node.js',
  'GoBD / ERP',
];

export const PortfolioFooter: React.FC<PortfolioFooterProps> = ({
  locale,
  profile,
  onNavigate,
  onChangeLocale,
}) => {
  const copy = PORTFOLIO_COPY[locale];
  const [openCol, setOpenCol] = useState<string | null>(null);
  const email = profile.email || 'samkazah444@gmail.com';
  const displayName = getLocalizedText(profile, 'name', locale, 'Sami Kazah');

  const columns = [
    {
      key: 'nav',
      title: 'NAVIGATION',
      links: [
        { label: copy.nav.experience, action: () => onNavigate('experience') },
        { label: copy.nav.projects, action: () => onNavigate('projects') },
        { label: copy.nav.skills, action: () => onNavigate('skills') },
        { label: copy.nav.books, action: () => onNavigate('books') },
        { label: copy.nav.education, action: () => onNavigate('credentials') },
      ],
    },
    {
      key: 'work',
      title: 'FLAGSHIP WORK',
      links: [
        { label: 'shelforia.de (Cloud ERP)', href: 'https://shelforia.de/' },
        { label: 'cloudvibe GmbH', href: 'https://cloudvibe.de/' },
        { label: 'De Gastuin Platform', action: () => onNavigate('projects') },
        { label: 'TCP-ERP Logistics', action: () => onNavigate('projects') },
      ],
    },
    {
      key: 'books',
      title: 'PUBLICATIONS',
      links: [
        {
          label: 'Design Patterns in Arabic',
          href: 'https://www.kotobati.com/book/design-patterns-arabic',
        },
        {
          label: 'Compilers Using ANTLR',
          href: 'https://www.kotobati.com/book/%D9%83%D8%AA%D8%A7%D8%A8-%D8%A7%D9%84%D9%85%D8%AA%D8%B1%D8%AC%D9%85%D8%A7%D8%AA-%D8%A8%D8%A7%D8%B3%D8%AA%D8%AE%D8%AF%D8%A7%D9%85-%D8%A7%D9%84-antlr',
        },
        {
          label: 'Comparative Studies',
          href: 'https://www.kotobati.com/book/%D9%83%D8%AA%D8%A7%D8%A8-%D8%A7%D9%84%D8%A5%D8%B3%D9%84%D8%A7%D9%85-%D9%88%D8%A7%D9%84%D8%A5%D8%B1%D9%87%D8%A7%D8%A8',
        },
      ],
    },
    {
      key: 'connect',
      title: 'CONNECT',
      links: [
        { label: email, href: `mailto:${email}` },
        ...(profile.socialLinks?.github
          ? [{ label: 'GitHub (@sami16kazah)', href: profile.socialLinks.github }]
          : []),
        ...(profile.socialLinks?.linkedin
          ? [{ label: 'LinkedIn', href: profile.socialLinks.linkedin }]
          : []),
        { label: 'Goch, Germany', action: () => onNavigate('contact') },
      ],
    },
  ];

  return (
    <footer className="sk-footer">
      {/* Flowing Aurora CTA Banner */}
      <div className="sk-footer-banner">
        <div className="sk-footer-banner-aurora" aria-hidden="true" />
        <div className="sk-container sk-footer-banner-inner">
          <div className="sk-footer-banner-copy">
            <span className="sk-footer-banner-eyebrow">{copy.footer.bannerEyebrow}</span>
            <h2>{copy.footer.bannerTitle}</h2>
            <p>{copy.footer.bannerSub}</p>
          </div>
          <div className="sk-footer-banner-actions">
            <button
              type="button"
              className="sk-btn sk-btn-banner-light"
              onClick={() => onNavigate('contact')}
            >
              <Mail size={15} />
              <span>{copy.nav.cta}</span>
              <ArrowUpRight size={14} />
            </button>
            {profile.socialLinks?.github && (
              <a
                href={profile.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="sk-btn sk-btn-banner-ghost"
              >
                <Github size={15} />
                <span>GITHUB</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Adobe-Style Sitemap & Core Stack Strip */}
      <div className="sk-container sk-footer-body">
        <div className="sk-sitemap-grid">
          {columns.map((col) => {
            const isOpen = openCol === col.key;
            return (
              <div key={col.key} className={`sk-sitemap-col ${isOpen ? 'is-open' : ''}`}>
                <button
                  type="button"
                  className="sk-sitemap-heading"
                  onClick={() => setOpenCol(isOpen ? null : col.key)}
                  aria-expanded={isOpen}
                >
                  <span>{col.title}</span>
                  <ChevronDown size={14} className="sk-acc-chevron" />
                </button>
                <ul className="sk-sitemap-list">
                  {col.links.map((item) => (
                    <li key={item.label}>
                      {'href' in item && item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith('http') ? '_blank' : undefined}
                          rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                          {item.label}
                        </a>
                      ) : (
                        <button type="button" onClick={item.action}>
                          {item.label}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Centered Core Stack Strip */}
        <div className="sk-featured-strip">
          <span className="sk-featured-label">{copy.footer.featuredLabel}</span>
          <div className="sk-featured-chips">
            {CORE_STRIP.map((item) => (
              <button
                key={item}
                type="button"
                className="sk-featured-chip"
                onClick={() => onNavigate('skills')}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Monumental Autonomous-Aurora Wordmark Showcase */}
        <div className="sk-horizon-showcase">
          <div className="sk-horizon-orb sk-horizon-orb-1" aria-hidden="true" />
          <div className="sk-horizon-orb sk-horizon-orb-2" aria-hidden="true" />
          <div className="sk-horizon-orb sk-horizon-orb-3" aria-hidden="true" />
          <SamiBrandLogo variant="monumental" />
        </div>

        {/* Bottom Legal, Language & Back-to-Top Bar */}
        <div className="sk-footer-bottom">
          <div className="sk-footer-langs" aria-label="Language versions">
            {(['en', 'de', 'ar'] as Locale[]).map((loc) => (
              <button
                key={loc}
                type="button"
                className={`sk-footer-lang-btn ${locale === loc ? 'is-active' : ''}`}
                onClick={() => onChangeLocale(loc)}
              >
                {loc === 'en' ? 'English' : loc === 'de' ? 'Deutsch' : 'العربية'}
              </button>
            ))}
          </div>

          <p className="sk-footer-copy">
            © {new Date().getFullYear()} {displayName}. {copy.footer.rights}
          </p>

          <div className="sk-footer-end">
            {profile.socialLinks?.linkedin && (
              <a
                href={profile.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="sk-footer-social"
                aria-label="LinkedIn"
              >
                <Linkedin size={15} />
              </a>
            )}
            {profile.socialLinks?.github && (
              <a
                href={profile.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="sk-footer-social"
                aria-label="GitHub"
              >
                <Github size={15} />
              </a>
            )}
            <button
              type="button"
              className="sk-back-top-btn"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <span>{copy.footer.backToTop}</span>
              <ArrowUp size={13} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
