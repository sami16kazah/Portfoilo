"use client";

import React from 'react';
import {
  ArrowUpRight,
  Menu,
  Moon,
  Sun,
  X,
} from 'lucide-react';
import { FaGithub as Github, FaLinkedin as Linkedin } from 'react-icons/fa';
import {
  PORTFOLIO_COPY,
  type Locale,
  type ProfileData,
} from './portfolioCopy';
import { SamiBrandLogo } from './SamiBrandLogo';

interface TopBarProps {
  theme: 'dark' | 'light';
  locale: Locale;
  activeSection: string;
  scrolled: boolean;
  pastHero: boolean;
  mobileMenuOpen: boolean;
  profile: ProfileData;
  onToggleTheme: () => void;
  onChangeLocale: (locale: Locale) => void;
  onToggleMobileMenu: () => void;
  onNavigate: (id: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  theme,
  locale,
  activeSection,
  scrolled,
  pastHero,
  mobileMenuOpen,
  profile,
  onToggleTheme,
  onChangeLocale,
  onToggleMobileMenu,
  onNavigate,
}) => {
  const copy = PORTFOLIO_COPY[locale];

  const navItems = [
    { id: 'experience', label: copy.nav.experience },
    { id: 'projects', label: copy.nav.projects },
    { id: 'skills', label: copy.nav.skills },
    { id: 'books', label: copy.nav.books },
    { id: 'credentials', label: copy.nav.education },
  ];

  const nextLocale: Locale = locale === 'en' ? 'de' : locale === 'de' ? 'ar' : 'en';

  return (
    <header
      className={`sk-topbar ${scrolled ? 'is-scrolled' : ''} ${mobileMenuOpen ? 'is-menu-open' : ''}`}
    >
      <div className="sk-topbar-inner">
        <div className="sk-topbar-left">
          <button
            type="button"
            className="sk-mobile-menu-btn mobile-only"
            onClick={onToggleMobileMenu}
            aria-label="Open main menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="sk-mobile-sheet"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <a
            href="#hero"
            className={`sk-topbar-brand ${pastHero || mobileMenuOpen ? 'is-expanded' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('hero');
            }}
            aria-label="Sami Kazah — Home"
          >
            <SamiBrandLogo
              variant="nav-animated"
              expanded={pastHero || mobileMenuOpen}
              subtitle={
                locale === 'de'
                  ? 'Software- & Cloud-Entwickler'
                  : locale === 'ar'
                  ? 'Software & Cloud Engineer'
                  : 'Software & Cloud Engineer'
              }
            />
          </a>

          <nav className="sk-topbar-nav desktop-only" aria-label="Primary navigation">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`sk-nav-trigger ${activeSection === item.id ? 'is-active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="sk-topbar-right">
          {/* Desktop Locale Segmented Cell */}
          <div className="sk-locale-cell desktop-only" role="group" aria-label="Language selector">
            {(['en', 'de', 'ar'] as Locale[]).map((loc) => (
              <button
                key={loc}
                type="button"
                className={`sk-locale-btn ${locale === loc ? 'is-active' : ''}`}
                onClick={() => onChangeLocale(loc)}
                aria-pressed={locale === loc}
              >
                {loc.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Mobile Compact Locale Toggle */}
          <button
            type="button"
            className="sk-mobile-util-btn mobile-only"
            onClick={() => onChangeLocale(nextLocale)}
            aria-label={`Switch language (${locale.toUpperCase()})`}
            title="Switch language"
          >
            <span className="sk-mobile-locale-code">{locale.toUpperCase()}</span>
          </button>

          {profile.socialLinks?.github && (
            <a
              href={profile.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="sk-topbar-cell sk-topbar-icon-cell desktop-wide-only"
              aria-label="GitHub"
              title="GitHub"
            >
              <Github size={15} />
            </a>
          )}

          {profile.socialLinks?.linkedin && (
            <a
              href={profile.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="sk-topbar-cell sk-topbar-icon-cell desktop-wide-only"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <Linkedin size={15} />
            </a>
          )}

          <button
            type="button"
            className="sk-topbar-cell sk-topbar-theme-cell"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            type="button"
            className="sk-topbar-cta-flush desktop-only"
            onClick={() => onNavigate('contact')}
          >
            <span>{copy.nav.cta}</span>
            <ArrowUpRight size={14} />
          </button>

          <button
            type="button"
            className="sk-mobile-cta mobile-only"
            onClick={() => onNavigate('contact')}
          >
            <span>{copy.nav.ctaShort}</span>
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>
    </header>
  );
};
