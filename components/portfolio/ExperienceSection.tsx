"use client";

import React, { useEffect, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  MapPin,
  Server,
} from 'lucide-react';
import {
  PORTFOLIO_COPY,
  getLocalizedList,
  getLocalizedText,
  resolveAssetUrl,
  type JobData,
  type Locale,
} from './portfolioCopy';
import { SectionHeader } from './SectionHeader';

interface ExperienceSectionProps {
  locale: Locale;
  jobs: JobData[];
  showTelemetry?: boolean;
}

interface TelemetryState {
  fps: number;
  ttfbMs: number | null;
  domReadyMs: number | null;
  fcpMs: number | null;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  locale,
  jobs,
  showTelemetry = true,
}) => {
  const copy = PORTFOLIO_COPY[locale];
  const [perfTab, setPerfTab] = useState<'telemetry' | 'pipeline'>('telemetry');
  const [telemetry, setTelemetry] = useState<TelemetryState>({
    fps: 60,
    ttfbMs: null,
    domReadyMs: null,
    fcpMs: null,
  });

  useEffect(() => {
    const readNav = () => {
      try {
        const nav = performance.getEntriesByType('navigation')[0] as
          | PerformanceNavigationTiming
          | undefined;
        const paint = performance.getEntriesByType('paint');
        const fcp = paint.find((e) => e.name === 'first-contentful-paint');
        setTelemetry((prev) => ({
          ...prev,
          ttfbMs: nav ? Math.max(1, Math.round(nav.responseStart - nav.requestStart)) : 18,
          domReadyMs: nav
            ? Math.max(1, Math.round(nav.domContentLoadedEventEnd - nav.startTime))
            : 142,
          fcpMs: fcp ? Math.max(1, Math.round(fcp.startTime)) : 190,
        }));
      } catch {
        // ignore restricted environments
      }
    };

    const timer = window.setTimeout(readNav, 350);
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let rafId = 0;
    let frames = 0;
    let last = performance.now();
    const tick = (now: number) => {
      frames += 1;
      const elapsed = now - last;
      if (elapsed >= 1000) {
        setTelemetry((prev) => ({
          ...prev,
          fps: Math.min(120, Math.round((frames * 1000) / elapsed)),
        }));
        frames = 0;
        last = now;
      }
      rafId = requestAnimationFrame(tick);
    };
    if (!prefersReduced) rafId = requestAnimationFrame(tick);

    return () => {
      window.clearTimeout(timer);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  if (!jobs || jobs.length === 0) return null;

  const fpsPct = Math.min(100, Math.round((telemetry.fps / 60) * 100));
  const circumference = 2 * Math.PI * 36;
  const dashOffset = circumference - (fpsPct / 100) * circumference;

  return (
    <section id="experience" className="sk-section">
      <div className="sk-container">
        <SectionHeader
          code={copy.sections.experience.code}
          label={copy.sections.experience.label}
          meta={copy.sections.experience.meta}
        />

        <div className="sk-section-intro">
          <h2 className="sk-display-h2">
            {copy.jobs.heading}{' '}
            <span className="sk-brand-highlight">{copy.jobs.headingAccent}</span>
          </h2>
          <p className="sk-lead">{copy.jobs.subtitle}</p>
        </div>

        <div className={`sk-exp-grid ${showTelemetry ? '' : 'is-full'}`}>
          {/* Left Column: Experience Cards */}
          <div className="sk-exp-list">
            {jobs.map((job) => {
              const role = getLocalizedText(job, 'role', locale, job.role);
              const location = getLocalizedText(job, 'location', locale, job.location || '');
              const summary = getLocalizedText(job, 'summary', locale, job.summary || '');
              const highlights = getLocalizedList(job, 'highlights', locale);
              const logoSrc = resolveAssetUrl(job.logoUrl);

              return (
                <article key={job._id} className="sk-exp-card">
                  <div className="sk-exp-head">
                    <div className="sk-exp-company-wrap">
                      {logoSrc ? (
                        <div className="sk-exp-logo-box">
                          <img src={logoSrc} alt={`${job.company} logo`} />
                        </div>
                      ) : (
                        <div className="sk-exp-logo-fallback">
                          {job.company.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="sk-exp-company-row">
                          <h3>{job.company}</h3>
                          {job.isCurrent && (
                            <span className="sk-mono-tag is-emerald">{copy.jobs.currentBadge}</span>
                          )}
                        </div>
                        <p className="sk-exp-role">{role}</p>
                        <div className="sk-exp-meta">
                          {location && (
                            <span>
                              <MapPin size={12} /> {location}
                            </span>
                          )}
                          <span>
                            {job.startDate} – {job.endDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {job.companyUrl && (
                      <a
                        href={job.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sk-btn sk-btn-outline sk-btn-sm"
                      >
                        <span>{job.company.replace(/\s+GmbH/i, '')}</span>
                        <ArrowUpRight size={13} />
                      </a>
                    )}
                  </div>

                  {summary && <p className="sk-exp-summary">{summary}</p>}

                  {highlights.length > 0 && (
                    <div className="sk-exp-block">
                      <span className="sk-micro-label">{copy.jobs.highlightsTitle}</span>
                      <ul className="sk-exp-highlights">
                        {highlights.map((item, i) => (
                          <li key={i}>
                            <CheckCircle2 size={14} className="sk-check-icon" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {job.performanceMetrics && job.performanceMetrics.length > 0 && (
                    <div className="sk-exp-metrics">
                      {job.performanceMetrics.map((m, i) => (
                        <div key={i} className="sk-metric-cell">
                          <span className="sk-metric-label">
                            {getLocalizedText(m, 'label', locale, m.label)}
                          </span>
                          <strong className="sk-metric-value">{m.value}</strong>
                          <small className="sk-metric-detail">
                            {getLocalizedText(m, 'detail', locale, m.detail || '')}
                          </small>
                        </div>
                      ))}
                    </div>
                  )}

                  {job.techStack && job.techStack.length > 0 && (
                    <div className="sk-exp-block">
                      <span className="sk-micro-label">{copy.jobs.stackTitle}</span>
                      <div className="sk-tag-row">
                        {job.techStack.map((tag) => (
                          <span key={tag} className="sk-tech-chip">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {/* Right Column: Live Browser Telemetry & Cloud Pipeline Console */}
          {showTelemetry && (
            <aside className="sk-telemetry-panel">
              <div className="sk-telemetry-top">
                <div className="sk-telemetry-tabs" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={perfTab === 'telemetry'}
                    className={`sk-tab-btn ${perfTab === 'telemetry' ? 'is-active' : ''}`}
                    onClick={() => setPerfTab('telemetry')}
                  >
                    <Activity size={13} />
                    <span>{copy.jobs.tabTelemetry}</span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={perfTab === 'pipeline'}
                    className={`sk-tab-btn ${perfTab === 'pipeline' ? 'is-active' : ''}`}
                    onClick={() => setPerfTab('pipeline')}
                  >
                    <Server size={13} />
                    <span>{copy.jobs.tabPipeline}</span>
                  </button>
                </div>
              </div>

              {perfTab === 'telemetry' ? (
                <div className="sk-telemetry-body">
                  <div className="sk-fps-card">
                    <svg viewBox="0 0 88 88" className="sk-fps-ring" aria-hidden="true">
                      <circle cx="44" cy="44" r="36" className="sk-fps-track" />
                      <circle
                        cx="44"
                        cy="44"
                        r="36"
                        className="sk-fps-progress"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                      />
                    </svg>
                    <div className="sk-fps-readout">
                      <span className="sk-micro-label">{copy.jobs.fpsLabel}</span>
                      <strong>{telemetry.fps} FPS</strong>
                      <small>{copy.jobs.measureNote}</small>
                    </div>
                  </div>

                  <div className="sk-runtime-grid">
                    <div className="sk-runtime-cell">
                      <span>{copy.jobs.fcpLabel}</span>
                      <strong>{telemetry.fcpMs !== null ? `${telemetry.fcpMs} ms` : '—'}</strong>
                    </div>
                    <div className="sk-runtime-cell">
                      <span>{copy.jobs.domLabel}</span>
                      <strong>{telemetry.domReadyMs !== null ? `${telemetry.domReadyMs} ms` : '—'}</strong>
                    </div>
                    <div className="sk-runtime-cell">
                      <span>{copy.jobs.ttfbLabel}</span>
                      <strong>{telemetry.ttfbMs !== null ? `${telemetry.ttfbMs} ms` : '—'}</strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="sk-pipeline-body">
                  {copy.jobs.pipelineSteps.map((step, i) => (
                    <div key={step.code} className="sk-pipeline-step">
                      <div className="sk-pipeline-node">
                        <span className="sk-pipeline-code">{step.code}</span>
                        <div className="sk-pipeline-copy">
                          <strong>{step.title}</strong>
                          <small>{step.detail}</small>
                        </div>
                        <Cpu size={15} className="sk-pipeline-icon" />
                      </div>
                      {i < copy.jobs.pipelineSteps.length - 1 && (
                        <div className="sk-pipeline-wire" aria-hidden="true">
                          <span className="sk-pipeline-packet" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </aside>
          )}
        </div>
      </div>
    </section>
  );
};
