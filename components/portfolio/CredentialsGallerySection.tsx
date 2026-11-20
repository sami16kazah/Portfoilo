"use client";

import React, { useEffect, useState } from 'react';
import {
  Award,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Languages,
  X,
} from 'lucide-react';
import {
  PORTFOLIO_COPY,
  getLocalizedText,
  resolveAssetUrl,
  type CertificationData,
  type EducationData,
  type Locale,
  type LocalizedLanguage,
  type PhotoData,
} from './portfolioCopy';
import { SectionHeader } from './SectionHeader';

interface CredentialsGallerySectionProps {
  locale: Locale;
  education: EducationData[];
  certifications: CertificationData[];
  languages: LocalizedLanguage[];
  photos: PhotoData[];
}

function proficiencyToPct(level?: string): number {
  const code = (level || '').toUpperCase();
  if (code.includes('C2') || code.includes('NATIVE')) return 100;
  if (code.includes('C1')) return 90;
  if (code.includes('B2')) return 80;
  if (code.includes('B1')) return 66;
  return 75;
}

export const CredentialsGallerySection: React.FC<CredentialsGallerySectionProps> = ({
  locale,
  education,
  certifications,
  languages,
  photos,
}) => {
  const copy = PORTFOLIO_COPY[locale];
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    if (lightboxIdx === null || photos.length === 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === 'ArrowRight') setLightboxIdx((p) => (p === null ? null : (p + 1) % photos.length));
      if (e.key === 'ArrowLeft')
        setLightboxIdx((p) => (p === null ? null : (p - 1 + photos.length) % photos.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIdx, photos.length]);

  return (
    <section id="credentials" className="sk-section">
      <div className="sk-container">
        <SectionHeader
          code={copy.sections.credentials.code}
          label={copy.sections.credentials.label}
          meta={copy.sections.credentials.meta}
        />

        <div className="sk-section-intro">
          <h2 className="sk-display-h2">
            {copy.credentials.heading}{' '}
            <span className="sk-brand-highlight">{copy.credentials.headingAccent}</span>
          </h2>
        </div>

        <div className="sk-cred-grid">
          {/* Left: Education & Certifications */}
          <div className="sk-cred-panel">
            <div className="sk-cred-panel-head">
              <GraduationCap size={17} />
              <h3>{copy.credentials.eduTitle}</h3>
            </div>
            <div className="sk-edu-list">
              {education.map((edu) => (
                <div key={edu._id} className="sk-edu-row">
                  <div className="sk-edu-top">
                    <strong>{getLocalizedText(edu, 'degree', locale, edu.degree)}</strong>
                    {edu.year && <span className="sk-mono-tag">{edu.year}</span>}
                  </div>
                  <span className="sk-edu-inst">
                    {getLocalizedText(edu, 'institution', locale, edu.institution)}
                  </span>
                  {edu.description && (
                    <p className="sk-edu-desc">
                      {getLocalizedText(edu, 'description', locale, edu.description)}
                    </p>
                  )}
                </div>
              ))}
              {certifications.map((cert) => (
                <div key={cert._id} className="sk-edu-row is-cert">
                  <div className="sk-edu-top">
                    <span className="sk-cert-title">
                      <Award size={14} />
                      <strong>{getLocalizedText(cert, 'name', locale, cert.name)}</strong>
                    </span>
                    {cert.date && <span className="sk-mono-tag">{cert.date}</span>}
                  </div>
                  <span className="sk-edu-inst">{cert.issuer}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Languages */}
          <div className="sk-cred-panel">
            <div className="sk-cred-panel-head">
              <Languages size={17} />
              <h3>{copy.credentials.langTitle}</h3>
            </div>
            <div className="sk-lang-list">
              {languages.map((lang) => {
                const pct = proficiencyToPct(lang.proficiency);
                return (
                  <div key={lang.name} className="sk-lang-row">
                    <div className="sk-lang-top">
                      <strong>{getLocalizedText(lang, 'name', locale, lang.name)}</strong>
                      <span className="sk-mono-tag is-emerald">{lang.proficiency}</span>
                    </div>
                    <div className="sk-skill-meter" aria-hidden="true">
                      <span className="sk-skill-meter-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {photos.length > 0 && (
          <div id="gallery" className="sk-gallery-wrap">
            <div className="sk-gallery-head">
              <span className="sk-micro-label">{copy.credentials.galleryTitle}</span>
            </div>
            <div className="sk-gallery-grid">
              {photos.map((photo, idx) => (
                <button
                  key={photo._id || idx}
                  type="button"
                  className="sk-gallery-tile"
                  onClick={() => setLightboxIdx(idx)}
                >
                  <img
                    src={resolveAssetUrl(photo.url)}
                    alt={photo.title || `Gallery photo ${idx + 1}`}
                    loading="lazy"
                  />
                  {photo.title && (
                    <span className="sk-gallery-caption">{photo.title}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Lightbox */}
        {lightboxIdx !== null && photos[lightboxIdx] && (
          <div
            className="sk-modal-backdrop"
            role="dialog"
            aria-modal="true"
            onClick={() => setLightboxIdx(null)}
          >
            <div className="sk-lightbox-card" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="sk-modal-close sk-lightbox-close"
                onClick={() => setLightboxIdx(null)}
                aria-label={copy.credentials.close}
              >
                <X size={18} />
              </button>
              <img
                src={resolveAssetUrl(photos[lightboxIdx].url)}
                alt={photos[lightboxIdx].title || 'Photo preview'}
                className="sk-lightbox-img"
              />
              <div className="sk-lightbox-foot">
                <span>{photos[lightboxIdx].title || `Photo ${lightboxIdx + 1}`}</span>
                <div className="sk-lightbox-nav">
                  <button
                    type="button"
                    aria-label="Previous"
                    onClick={() => setLightboxIdx((lightboxIdx - 1 + photos.length) % photos.length)}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    aria-label="Next"
                    onClick={() => setLightboxIdx((lightboxIdx + 1) % photos.length)}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
