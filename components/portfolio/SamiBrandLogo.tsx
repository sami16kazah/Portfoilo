"use client";

import React from 'react';

interface SamiBrandLogoProps {
  variant?: 'nav-animated' | 'monumental' | 'mark';
  expanded?: boolean;
  subtitle?: string;
  className?: string;
}

/**
 * Bespoke geometric "SK" architectural monogram + wordmark.
 * - `nav-animated`: Single unified SVG that displays ONLY the centered SK monogram in the hero,
 *   then smoothly unfolds the full "SAMI KAZAH / Software & Cloud Engineer" wordmark to the right on scroll.
 * - `monumental`: Large autonomous aurora-swept footer centerpiece.
 */
export const SamiBrandLogo: React.FC<SamiBrandLogoProps> = ({
  variant = 'nav-animated',
  expanded = false,
  subtitle = 'Software & Cloud Engineer',
  className = '',
}) => {
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
      <div className={`sk-logo-monumental ${className}`} role="img" aria-label="Sami Kazah">
        <svg viewBox="0 0 760 150" className="sk-logo-monumental-svg" aria-hidden="true">
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
            fontFamily="'Geist Mono', monospace"
            fontWeight="500"
            fontSize="16"
            letterSpacing="4.5"
            fill="var(--ink-muted)"
          >
            SOFTWARE · CLOUD · FULL-STACK ENGINEERING
          </text>
        </svg>
      </div>
    );
  }

  return (
    <span
      className={`sk-logo-nav-anim ${expanded ? 'is-expanded' : ''} ${className}`}
      role="img"
      aria-label="Sami Kazah — Software & Cloud Engineer"
    >
      <svg viewBox="0 0 340 72" className="sk-logo-nav-anim-svg" aria-hidden="true">
        <defs>
          <linearGradient id="sk-nav-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--sk-indigo)" />
            <stop offset="55%" stopColor="var(--sk-cyan)" />
            <stop offset="100%" stopColor="var(--sk-emerald)" />
          </linearGradient>
        </defs>

        {/* Unified Monogram Group: centered in hero, anchors left as wordmark unfolds */}
        <g className="sk-nav-anim-mark">
          <rect
            x="6"
            y="10"
            width="52"
            height="52"
            rx="10"
            fill="var(--bg-card)"
            stroke="url(#sk-nav-grad)"
            strokeWidth="2.4"
          />
          <path
            d="M27.5 26H21C18.7 26 17 27.5 17 29.6C17 31.6 18.6 33 21.1 33.6L25 34.6C27.7 35.2 29.2 36.7 29.2 39.2C29.2 41.9 27.1 44 23.9 44H17"
            fill="none"
            stroke="var(--ink-strong)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M35.5 26V44M46 26L36.5 35L47 44"
            fill="none"
            stroke="url(#sk-nav-grad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Wordmark + Gray Slogan unfolding smoothly to the right on scroll */}
        <g className="sk-nav-anim-wordmark">
          <text
            x="72"
            y="37"
            fontFamily="'Bricolage Grotesque', 'Archivo', system-ui, sans-serif"
            fontWeight="800"
            fontSize="24"
            letterSpacing="-0.5"
            fill="var(--ink-strong)"
          >
            SAMI KAZAH
          </text>
          <text
            x="73"
            y="56"
            fontFamily="'Geist Mono', monospace"
            fontWeight="500"
            fontSize="11.5"
            letterSpacing="0.5"
            fill="var(--ink-muted)"
          >
            {subtitle}
          </text>
        </g>
      </svg>
    </span>
  );
};
