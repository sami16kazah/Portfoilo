"use client";

import React, { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Code2,
  FileCheck2,
  Play,
  Scale,
  Truck,
  Users,
} from 'lucide-react';
import {
  PORTFOLIO_COPY,
  getLocalizedList,
  getLocalizedText,
  resolveAssetUrl,
  type Locale,
  type ProjectData,
} from './portfolioCopy';
import { SectionHeader } from './SectionHeader';

interface ProjectsSectionProps {
  locale: Locale;
  projects: ProjectData[];
  selectedIndex: number;
  onSelectIndex: (idx: number) => void;
}

const SHELFORIA_MODULES = [
  {
    id: 'inventory',
    Icon: BookOpen,
    badge: 'CATALOG ENGINE',
    title: { en: 'Catalog & Desiderata', de: 'Bestand & Desiderata', ar: 'المخزون والكتالوجات' },
    desc: {
      en: 'Precision cataloging for rare books, first editions, fine art, autographs & collector wishlists.',
      de: 'Präzise Erfassung für Antiquariat, Erstausgaben, Kunst, Autographen & Suchwünsche.',
      ar: 'فهرسة دقيقة للكتب النادرة والطبعات الأولى والتحف الفنية وطلبات المقتنين.',
    },
  },
  {
    id: 'gobd',
    Icon: FileCheck2,
    badge: 'GDPDU READY',
    title: { en: 'GoBD & E-Invoicing', de: 'GoBD & E-Rechnung', ar: 'الفوترة الإلكترونية GoBD' },
    desc: {
      en: 'Immutable finalized ledger at DB level plus validated XRechnung (EN 16931) & ZUGFeRD PDFs.',
      de: 'Unveränderliche Festschreibung in der Datenbank plus XRechnung (EN 16931) & ZUGFeRD.',
      ar: 'سجلات محاسبية غير قابلة للتعديل وفق GoBD مع التحقق من فواتير XRechnung و ZUGFeRD.',
    },
  },
  {
    id: 'tax',
    Icon: Scale,
    badge: 'TAX AUTOMATION',
    title: { en: '§ 25a UStG & EU-OSS', de: '§ 25a UStG & EU-OSS', ar: 'الضرائب التفاضلية و OSS' },
    desc: {
      en: 'Per-item margin scheme (§ 25a UStG), EU destination VAT, VIES checks, UStVA & ZM reports.',
      de: 'Differenzbesteuerung (§ 25a UStG) je Artikel, EU-OSS, USt-IdNr.-Prüfung, UStVA & ZM.',
      ar: 'حساب ضريبة الهامش لكل قطعة مع فحص أرقام الضرائب الأوروبية وتقارير EU-OSS.',
    },
  },
  {
    id: 'marketplaces',
    Icon: Truck,
    badge: 'MULTI-CHANNEL',
    title: { en: 'Marketplaces & DHL', de: 'Marktplätze & DHL', ar: 'الأسواق وشحن DHL' },
    desc: {
      en: 'Synced multi-channel listings with eBay, AbeBooks / ZVAB, Booklooker, DHL labels & PayPal.',
      de: 'Synchronisierte Angebote auf eBay, AbeBooks / ZVAB, Booklooker inkl. DHL & PayPal.',
      ar: 'مزامنة مباشرة مع eBay و AbeBooks / ZVAB و Booklooker وإصدار ملصقات DHL.',
    },
  },
];

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  locale,
  projects,
  selectedIndex,
  onSelectIndex,
}) => {
  const copy = PORTFOLIO_COPY[locale];
  const [stageTab, setStageTab] = useState<'preview' | 'architecture' | 'credits'>('preview');
  const [chapterIdx, setChapterIdx] = useState(0);
  const [shelforiaMod, setShelforiaMod] = useState(0);

  const activeProject = projects[selectedIndex] || projects[0];

  useEffect(() => {
    setChapterIdx(0);
    setStageTab('preview');
  }, [selectedIndex]);

  if (!activeProject) return null;

  const title = getLocalizedText(activeProject, 'title', locale, activeProject.title);
  const subtitle = getLocalizedText(activeProject, 'subtitle', locale, activeProject.subtitle || '');
  const paragraphs = getLocalizedList(activeProject, 'description', locale);
  const highlights = getLocalizedList(activeProject, 'highlights', locale);
  const credits = getLocalizedText(activeProject, 'credits', locale, activeProject.credits || '');
  const isShelforia = activeProject.title.toLowerCase().includes('shelforia');
  const chapters = activeProject.videoChapters || [];
  const activeVideoUrl =
    chapters.length > 0 ? chapters[chapterIdx]?.url || activeProject.videoUrl : activeProject.videoUrl;
  const imgSrc = resolveAssetUrl(activeProject.imageUrl);
  const logoSrc = resolveAssetUrl(activeProject.logoUrl);

  return (
    <section id="projects" className="sk-section sk-section-alt">
      <div className="sk-container">
        <SectionHeader
          code={copy.sections.projects.code}
          label={copy.sections.projects.label}
          meta={copy.sections.projects.meta}
        />

        <div className="sk-section-intro">
          <h2 className="sk-display-h2">
            {copy.projects.heading}{' '}
            <span className="sk-brand-highlight">{copy.projects.headingAccent}</span>
          </h2>
          <p className="sk-lead">{copy.projects.subtitle}</p>
        </div>

        {/* Project Selector Bar */}
        <div className="sk-proj-selector" role="tablist" aria-label="Featured projects">
          {projects.map((proj, idx) => {
            const active = idx === selectedIndex;
            const projLogo = resolveAssetUrl(proj.logoUrl);
            return (
              <button
                key={proj._id}
                type="button"
                role="tab"
                aria-selected={active}
                className={`sk-proj-tab ${active ? 'is-active' : ''}`}
                onClick={() => onSelectIndex(idx)}
              >
                <span className="sk-proj-tab-idx">{String(idx + 1).padStart(2, '0')}</span>
                {projLogo ? (
                  <img src={projLogo} alt="" className="sk-proj-tab-logo" />
                ) : (
                  <span
                    className="sk-proj-tab-swatch"
                    style={{ background: proj.brandColor || 'var(--sk-indigo)' }}
                  />
                )}
                <span className="sk-proj-tab-title">
                  {getLocalizedText(proj, 'title', locale, proj.title)}
                </span>
                {proj.date && <span className="sk-proj-tab-date">{proj.date}</span>}
              </button>
            );
          })}
        </div>

        {/* Interactive Featured Stage */}
        <div className="sk-proj-stage">
          {/* Left: Visual / Interactive Preview Media */}
          <div className="sk-proj-media-col">
            {imgSrc ? (
              <div className="sk-proj-image-frame">
                <img src={imgSrc} alt={title} className="sk-proj-hero-img" />
              </div>
            ) : activeVideoUrl ? (
              <div className="sk-proj-video-wrap">
                <video
                  key={activeVideoUrl}
                  src={activeVideoUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className="sk-proj-video"
                />
                {chapters.length > 1 && (
                  <div className="sk-video-chapters">
                    <span className="sk-micro-label">{copy.projects.chaptersLabel}</span>
                    <div className="sk-chapter-btns">
                      {chapters.map((ch, idx) => (
                        <button
                          key={ch.url}
                          type="button"
                          className={`sk-chapter-btn ${idx === chapterIdx ? 'is-active' : ''}`}
                          onClick={() => setChapterIdx(idx)}
                        >
                          <Play size={11} />
                          <span>{ch.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Custom Editorial Architectural Schematic for TCP-ERP */
              <div className="sk-proj-schematic" aria-hidden="true">
                <div className="sk-schematic-header">
                  <span>TCP-ERP · REAL-TIME LOGISTICS GRAPH</span>
                  <span className="sk-mono-tag is-emerald">LIVE SYNC</span>
                </div>
                <div className="sk-schematic-nodes">
                  <div className="sk-sch-node">
                    <strong>Retail Dealers</strong>
                    <small>Angular Web Portal</small>
                  </div>
                  <div className="sk-sch-arrow" />
                  <div className="sk-sch-node is-core">
                    <strong>Dispatch Core</strong>
                    <small>WebSockets · Route Engine</small>
                  </div>
                  <div className="sk-sch-arrow" />
                  <div className="sk-sch-node">
                    <strong>Driver Fleet</strong>
                    <small>Flutter Mobile App</small>
                  </div>
                </div>
              </div>
            )}

            {/* Shelforia Interactive 4-Module Explorer */}
            {isShelforia && (
              <div className="sk-shelforia-explorer">
                <div className="sk-shelforia-tabs">
                  {SHELFORIA_MODULES.map((mod, idx) => {
                    const IconComp = mod.Icon;
                    return (
                      <button
                        key={mod.id}
                        type="button"
                        className={`sk-shelf-btn ${idx === shelforiaMod ? 'is-active' : ''}`}
                        onClick={() => setShelforiaMod(idx)}
                      >
                        <IconComp size={14} />
                        <span>{mod.title[locale]}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="sk-shelforia-detail">
                  <span className="sk-mono-tag is-emerald">
                    {SHELFORIA_MODULES[shelforiaMod].badge}
                  </span>
                  <p>{SHELFORIA_MODULES[shelforiaMod].desc[locale]}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Editorial Copy, Tabs, Tags & Actions */}
          <div className="sk-proj-info-col">
            <div className="sk-proj-info-head">
              {logoSrc && <img src={logoSrc} alt="" className="sk-proj-info-logo" />}
              <div>
                <h3 className="sk-proj-title">{title}</h3>
                {subtitle && <p className="sk-proj-subtitle">{subtitle}</p>}
              </div>
            </div>

            <div className="sk-sub-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={stageTab === 'preview'}
                className={`sk-tab-btn ${stageTab === 'preview' ? 'is-active' : ''}`}
                onClick={() => setStageTab('preview')}
              >
                {copy.projects.tabPreview}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={stageTab === 'architecture'}
                className={`sk-tab-btn ${stageTab === 'architecture' ? 'is-active' : ''}`}
                onClick={() => setStageTab('architecture')}
              >
                {copy.projects.tabArchitecture}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={stageTab === 'credits'}
                className={`sk-tab-btn ${stageTab === 'credits' ? 'is-active' : ''}`}
                onClick={() => setStageTab('credits')}
              >
                {copy.projects.tabCredits}
              </button>
            </div>

            <div className="sk-proj-tab-body">
              {stageTab === 'preview' && (
                <div className="sk-proj-paragraphs">
                  {paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              )}

              {stageTab === 'architecture' && (
                <ul className="sk-exp-highlights">
                  {highlights.map((h, i) => (
                    <li key={i}>
                      <CheckCircle2 size={14} className="sk-check-icon" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}

              {stageTab === 'credits' && (
                <div className="sk-credits-box">
                  <Users size={18} className="sk-check-icon" />
                  <p>{credits}</p>
                </div>
              )}
            </div>

            {activeProject.tags && activeProject.tags.length > 0 && (
              <div className="sk-tag-row">
                {activeProject.tags.map((tag) => (
                  <span key={tag} className="sk-tech-chip">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="sk-proj-actions">
              {activeProject.demoUrl && (
                <a
                  href={activeProject.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sk-btn sk-btn-primary"
                >
                  <span>{copy.projects.visitSite}</span>
                  <ArrowUpRight size={15} />
                </a>
              )}
              {activeProject.repoUrl && (
                <a
                  href={activeProject.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sk-btn sk-btn-outline"
                >
                  <Code2 size={15} />
                  <span>{copy.projects.viewCode}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
