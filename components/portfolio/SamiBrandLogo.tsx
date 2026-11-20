"use client";

import React from 'react';
import type { Locale } from './portfolioCopy';

interface SamiBrandLogoProps {
  variant?: 'nav-animated' | 'monumental' | 'mark';
  expanded?: boolean;
  locale?: Locale;
  name?: string;
  subtitle?: string;
  className?: string;
}

/**
 * Bespoke geometric "SK" architectural monogram + wordmark.
 * - `nav-animated`: Shows ONLY the centered SK monogram in the hero, then smoothly unfolds
 *   the localized wordmark ("SAMI KAZAH" / "سامي قزح") beside it in BOTH LTR and RTL with zero overlap.
 * - `monumental`: Large autonomous aurora-swept footer centerpiece.
 */
export const SamiBrandLogo: React.FC<SamiBrandLogoProps> = ({
  variant = 'nav-animated',
  expanded = false,
  locale = 'en',
  name,
  subtitle,
  className = '',
}) => {
  const resolvedName = name || (locale === 'ar' ? 'سامي قزح' : 'SAMI KAZAH');
  const resolvedSub =
    subtitle ||
    (locale === 'ar'
      ? 'مهندس برمجيات وسحابة'
      : locale === 'de'
      ? 'Software- & Cloud-Entwickler'
      : 'Software & Cloud Engineer');

  if (variant === 'mark') {
    return (
      <svg
        viewBox="0 0 64 64"
        className={`sk-logo-mark ${className}`}
        aria-label="Sami Kazah monogram"
        role="img"
      >
        <defs>
          <linearGradient id="sk-mark-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--sk-indigo)" />
            <stop offset="55%" stopColor="var(--sk-cyan)" />
            <stop offset="100%" stopColor="var(--sk-emerald)" />
          </linearGradient>
        </defs>
        <rect
          x="4"
          y="4"
          width="56"
          height="56"
          rx="12"
          fill="var(--bg-card)"
          stroke="url(#sk-mark-grad)"
          strokeWidth="2.5"
        />
        <path
          d="M27 21H19.5C16.8 21 15 22.7 15 25.1C15 27.5 16.8 29 19.6 29.7L24.2 30.8C27.2 31.5 29 33.2 29 36.1C29 39.2 26.6 41.5 23 41.5H15"
          fill="none"
          stroke="var(--ink-strong)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M35.5 21V41.5M47.5 21L36.5 31.2L48.5 41.5"
          fill="none"
          stroke="url(#sk-mark-grad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (variant === 'monumental') {
    return (
      <div className={`sk-logo-monumental ${className}`} role="img" aria-label={resolvedName}>
        <svg viewBox="0 0 760 150" direction="ltr" className="sk-logo-monumental-svg" aria-hidden="true">
          <defs>
            <linearGradient
              id="sk-footer-aurora"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="30%" stopColor="#38bdf8" />
              <stop offset="62%" stopColor="#34d399" />
              <stop offset="85%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#818cf8" />
              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                values="-260 0; 260 0; -260 0"
                dur="9s"
                repeatCount="indefinite"
              />
            </linearGradient>
          </defs>
          <text
            x="380"
            y="102"
            textAnchor="middle"
            fontFamily="'Bricolage Grotesque', 'Archivo', system-ui, sans-serif"
            fontWeight="800"
            fontSize="106"
            letterSpacing="-3.5"
            fill="url(#sk-footer-aurora)"
          >
            SAMI KAZAH
          </text>
          <text
            x="380"
            y="138"
            textAnchor="middle"
            fontFamily={
              locale === 'ar'
                ? "'IBM Plex Sans Arabic', system-ui, sans-serif"
                : "'Geist Mono', monospace"
            }
            fontWeight="500"
            fontSize={locale === 'ar' ? '18' : '16'}
            letterSpacing={locale === 'ar' ? '0' : '4.5'}
            fill="var(--ink-muted)"
          >
            {locale === 'ar'
              ? 'هندسة البرمجيات · الأنظمة السحابية · التطوير المتكامل'
              : 'SOFTWARE · CLOUD · FULL-STACK ENGINEERING'}
          </text>
        </svg>
      </div>
    );
  }

  return (
    <span
      className={`sk-logo-nav-anim ${expanded ? 'is-expanded' : ''} ${className}`}
      role="img"
      aria-label={`${resolvedName} — ${resolvedSub}`}
    >
      <span className="sk-nav-mark-slot" aria-hidden="true">
        <SamiBrandLogo variant="mark" className="sk-nav-mark-svg" />
      </span>

      <span className="sk-nav-wordmark-wrap" aria-hidden="true">
        <span className="sk-nav-wordmark-inner">
          <strong className="sk-nav-wordmark-name">{resolvedName}</strong>
          <small className="sk-nav-wordmark-sub">{resolvedSub}</small>
        </span>
      </span>
    </span>
  );
};
