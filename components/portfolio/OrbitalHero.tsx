"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDownRight,
  BookOpen,
  Briefcase,
  Cloud,
  Code2,
  Cpu,
  Database,
  FileText,
  Globe,
  Layers,
  Mail,
  Server,
  ShieldCheck,
  Terminal,
  Zap,
} from 'lucide-react';
import { FaGithub as Github, FaLinkedin as Linkedin } from 'react-icons/fa';
import {
  PORTFOLIO_COPY,
  getLocalizedList,
  getLocalizedText,
  resolveAssetUrl,
  type Locale,
  type ProfileData,
} from './portfolioCopy';

interface OrbitalHeroProps {
  locale: Locale;
  profile: ProfileData;
  onNavigate: (id: string) => void;
}

interface OrbitNode {
  id: string;
  code: string;
  label: string;
  detail: string;
  accent: string;
  target: string;
  Icon: React.ComponentType<{ size?: number | string }>;
  ring: 0 | 1 | 2;
  baseAngle: number;
  speed: number;
  depth: number;
}

const ORBIT_DEFS = [
  { id: 'aws', code: '01', label: 'AWS Frankfurt', detail: 'EC2 · VPC · RDS · S3 · Lambda', accent: '#f59e0b', target: 'skills', Icon: Cloud },
  { id: 'ts', code: '02', label: 'TypeScript', detail: 'Strict Full-Stack Architecture', accent: '#3b82f6', target: 'skills', Icon: Code2 },
  { id: 'shelforia', code: '03', label: 'shelforia.de', detail: 'Multi-Tenant Cloud ERP', accent: '#10b981', target: 'projects', Icon: Layers },
  { id: 'react', code: '04', label: 'React & Next.js', detail: 'SSR · App Router · Performance', accent: '#06b6d4', target: 'skills', Icon: Zap },
  { id: 'pg', code: '05', label: 'PostgreSQL', detail: 'Immutable GoBD Ledger & Indexing', accent: '#6366f1', target: 'skills', Icon: Database },
  { id: 'gobd', code: '06', label: 'GoBD & XRechnung', detail: 'EN 16931 & ZUGFeRD Compliance', accent: '#14b8a6', target: 'experience', Icon: ShieldCheck },
  { id: 'node', code: '07', label: 'Node.js & APIs', detail: 'Event-Driven Services & Sync', accent: '#22c55e', target: 'skills', Icon: Server },
  { id: 'books', code: '08', label: '18,000+ Readers', detail: 'Published CS & Compiler Author', accent: '#f97316', target: 'books', Icon: BookOpen },
  { id: 'spring', code: '09', label: 'Java & Spring', detail: 'Enterprise Backend & OOP', accent: '#8b5cf6', target: 'skills', Icon: Cpu },
  { id: 'mongo', code: '10', label: 'MongoDB', detail: 'Flexible CMS & Document Models', accent: '#16a34a', target: 'skills', Icon: Terminal },
  { id: 'cloudvibe', code: '11', label: 'cloudvibe GmbH', detail: 'Software & Cloud Systems · Goch', accent: '#2563eb', target: 'experience', Icon: Briefcase },
  { id: 'web', code: '12', label: 'EN · DE · AR', detail: 'Multilingual & RTL Engineering', accent: '#ec4899', target: 'credentials', Icon: Globe },
];

export const OrbitalHero: React.FC<OrbitalHeroProps> = ({
  locale,
  profile,
  onNavigate,
}) => {
  const copy = PORTFOLIO_COPY[locale];
  const stageRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [stageSize, setStageSize] = useState({ width: 1280, height: 760 });
  const pointerTarget = useRef({ x: 0, y: 0 });
  const pointerSmooth = useRef({ x: 0, y: 0 });
  const pausedRef = useRef(false);

  const orbitItems: OrbitNode[] = useMemo(() => {
    return ORBIT_DEFS.map((item, i) => {
      const ring = (i % 3) as 0 | 1 | 2;
      const indexInRing = Math.floor(i / 3);
      const countInRing = 4;
      const angleOffset = ring * 0.52 + 0.35;
      const baseAngle = (indexInRing / countInRing) * Math.PI * 2 + angleOffset;
      const speed = ring === 0 ? 0.00015 : ring === 1 ? -0.000115 : 0.00009;
      const depth = ring === 0 ? 1.0 : ring === 1 ? 0.92 : 0.85;
      return { ...item, ring, baseAngle, speed, depth };
    });
  }, []);

  useEffect(() => {
    pausedRef.current = hoveredId !== null;
  }, [hoveredId]);

  useEffect(() => {
    const updateSize = () => {
      if (!stageRef.current) return;
      const rect = stageRef.current.getBoundingClientRect();
      setStageSize({ width: rect.width, height: rect.height });
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    if (stageRef.current) ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let rafId = 0;
    let lastTime = performance.now();
    let elapsed = 0;

    const frame = (now: number) => {
      const dt = Math.min(48, now - lastTime);
      lastTime = now;
      elapsed += pausedRef.current ? dt * 0.14 : dt;
      pointerSmooth.current.x += (pointerTarget.current.x - pointerSmooth.current.x) * 0.06;
      pointerSmooth.current.y += (pointerTarget.current.y - pointerSmooth.current.y) * 0.06;
      setTick(elapsed);
      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    pointerTarget.current = {
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    };
  };

  const isCompact = stageSize.width < 720;
  const cx = stageSize.width / 2;
  const cy = stageSize.height / 2;

  const rings = isCompact
    ? [
        { rx: Math.max(192, stageSize.width * 0.53), ry: Math.max(355, stageSize.height * 0.48) },
        { rx: Math.max(228, stageSize.width * 0.63), ry: Math.max(400, stageSize.height * 0.54) },
        { rx: Math.max(264, stageSize.width * 0.73), ry: Math.max(445, stageSize.height * 0.6) },
      ]
    : [
        { rx: Math.max(430, stageSize.width * 0.34), ry: Math.max(325, stageSize.height * 0.39) },
        { rx: Math.max(540, stageSize.width * 0.43), ry: Math.max(395, stageSize.height * 0.48) },
        { rx: Math.max(660, stageSize.width * 0.52), ry: Math.max(465, stageSize.height * 0.57) },
      ];

  const hoveredNode = hoveredId ? orbitItems.find((n) => n.id === hoveredId) ?? null : null;
  const displayName = getLocalizedText(profile, 'name', locale, 'Sami Kazah');
  const displayTitle = getLocalizedText(profile, 'title', locale, 'Software & Full-Stack Engineer');
  const bioList = getLocalizedList(profile, 'bio', locale);
  const leadBio = bioList[0] || '';
  const avatarSrc = resolveAssetUrl(profile.avatarUrl || '/assets/images/sami.jpg');
  const email = profile.email || 'samkazah444@gmail.com';

  const tickerItems = [
    'SOFTWARE ENGINEER @ CLOUDVIBE GMBH',
    'CO-ARCHITECT OF SHELFORIA.DE',
    'AWS FRANKFURT · MULTI-TENANT CLOUD',
    'TYPESCRIPT · REACT · NEXT.JS · NODE.JS',
    'POSTGRESQL · MONGODB · GOBD / XRECHNUNG',
    'PUBLISHED CS AUTHOR · 18,000+ DOWNLOADS',
    'GOCH, GERMANY · EN / DE / AR',
  ];

  return (
    <section id="hero" className="sk-hero-section">
      <div
        ref={stageRef}
        className="sk-hero-stage"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => {
          pointerTarget.current = { x: 0, y: 0 };
        }}
      >
        <div className="sk-hero-aurora" aria-hidden="true" />

        {/* Concentric Calibrated Orbital Rings (Full-Viewport ArtCraft Signature) */}
        <svg
          className="sk-orbit-svg"
          width={stageSize.width}
          height={stageSize.height}
          viewBox={`0 0 ${stageSize.width} ${stageSize.height}`}
          aria-hidden="true"
        >
          <g transform={`translate(${pointerSmooth.current.x * 12}, ${pointerSmooth.current.y * 8})`}>
            {rings.map((r, idx) => {
              const rot = (tick * (idx % 2 === 0 ? 0.004 : -0.0032)) % 360;
              return (
                <g key={idx}>
                  <ellipse
                    cx={cx}
                    cy={cy}
                    rx={r.rx}
                    ry={r.ry}
                    fill="none"
                    className={`sk-orbit-ring sk-orbit-ring-${idx}`}
                  />
                  <ellipse
                    cx={cx}
                    cy={cy}
                    rx={r.rx}
                    ry={r.ry}
                    fill="none"
                    stroke={idx === 0 ? 'var(--sk-indigo)' : idx === 1 ? 'var(--sk-emerald)' : 'var(--sk-amber)'}
                    strokeOpacity="0.45"
                    strokeWidth="1.5"
                    strokeDasharray="72 920"
                    strokeDashoffset={-rot * 6}
                  />
                  {Array.from({ length: 24 }).map((_, tIdx) => {
                    const a = (tIdx / 24) * Math.PI * 2 + idx * 0.25;
                    return (
                      <line
                        key={tIdx}
                        x1={cx + Math.cos(a) * (r.rx - 4)}
                        y1={cy + Math.sin(a) * (r.ry - 4)}
                        x2={cx + Math.cos(a) * (r.rx + 4)}
                        y2={cy + Math.sin(a) * (r.ry + 4)}
                        className="sk-orbit-tick"
                      />
                    );
                  })}
                </g>
              );
            })}
            <line x1={cx} y1={24} x2={cx} y2={stageSize.height - 24} className="sk-orbit-axis" />
            <line x1={24} y1={cy} x2={stageSize.width - 24} y2={cy} className="sk-orbit-axis" />
          </g>
        </svg>

        {/* Orbiting Engineering & Domain Tiles */}
        <div className="sk-orbit-icons-layer" aria-label="Interactive engineering capabilities">
          {orbitItems.map((item) => {
            const r = rings[item.ring];
            const angle = item.baseAngle + tick * item.speed;
            const parallaxFactor = (3 - item.ring) * 8;
            const x = cx + Math.cos(angle) * r.rx + pointerSmooth.current.x * parallaxFactor;
            const y = cy + Math.sin(angle) * r.ry + pointerSmooth.current.y * parallaxFactor * 0.75;
            const isHovered = hoveredId === item.id;
            const scale = isHovered ? 1.16 : item.depth;
            if (isCompact && item.ring === 2) return null;

            const dxNorm = Math.abs(x - cx) / (isCompact ? 176 : 310);
            const dyNorm = Math.abs(y - cy) / (isCompact ? 325 : 240);
            const inTextZone = dxNorm < 1 && dyNorm < 1;
            const tileOpacity = isHovered ? 1 : inTextZone ? (isCompact ? 0.1 : 0.22) : 1;
            const IconComp = item.Icon;

            return (
              <button
                key={item.id}
                type="button"
                className={`sk-orbit-tile ${isHovered ? 'is-hovered' : ''}`}
                style={{
                  transform: `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`,
                  opacity: tileOpacity,
                  '--tile-accent': item.accent,
                } as React.CSSProperties}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(item.id)}
                onBlur={() => setHoveredId(null)}
                onClick={() => onNavigate(item.target)}
                aria-label={`${item.label}: ${item.detail}`}
              >
                <span className="sk-orbit-tile-inner">
                  <IconComp size={isCompact ? 20 : 27} />
                </span>
                <span className="sk-orbit-tile-code">{item.code}</span>
              </button>
            );
          })}
        </div>

        {/* Floating Hover HUD Pill */}
        <div className={`sk-orbit-hud ${hoveredNode ? 'is-visible' : ''}`} role="status" aria-live="polite">
          {hoveredNode && (
            <>
              <span className="sk-orbit-hud-dot" style={{ background: hoveredNode.accent }} />
              <span className="sk-orbit-hud-index">{hoveredNode.code}</span>
              <strong>{hoveredNode.label}</strong>
              <span className="sk-orbit-hud-sep">·</span>
              <span className="sk-orbit-hud-hint">{hoveredNode.detail}</span>
            </>
          )}
        </div>

        {/* Center Focal Identity */}
        <div className="sk-hero-center">
          <div className="sk-hero-mask" aria-hidden="true" />

          <div className="sk-hero-avatar-frame">
            <img src={avatarSrc} alt={displayName} className="sk-hero-avatar" />
          </div>

          <h1 className="sk-hero-name">{displayName}</h1>
          <p className="sk-hero-role">
            <span className="sk-brand-highlight">{displayTitle}</span>
          </p>

          <p className="sk-hero-subtitle">{leadBio}</p>

          <div className="sk-hero-actions">
            <button type="button" className="sk-btn sk-btn-primary" onClick={() => onNavigate('projects')}>
              <Layers size={15} />
              <span>{copy.hero.viewWork}</span>
            </button>
            <button type="button" className="sk-btn sk-btn-outline" onClick={() => onNavigate('contact')}>
              <Mail size={15} />
              <span>{copy.hero.contactMe}</span>
            </button>
            {profile.cvUrl && (
              <a
                href={profile.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="sk-btn sk-btn-outline"
              >
                <FileText size={15} />
                <span>{copy.hero.resume}</span>
              </a>
            )}
          </div>

          <div className="sk-hero-direct-links">
            <a href={`mailto:${email}`} className="sk-inline-link">
              <Mail size={13} />
              <span>{email}</span>
            </a>
            <span className="sk-dot-sep" aria-hidden="true">·</span>
            {profile.socialLinks?.github && (
              <>
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sk-inline-link"
                >
                  <Github size={13} />
                  <span>GitHub</span>
                </a>
                <span className="sk-dot-sep" aria-hidden="true">·</span>
              </>
            )}
            {profile.socialLinks?.linkedin && (
              <>
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sk-inline-link"
                >
                  <Linkedin size={13} />
                  <span>LinkedIn</span>
                </a>
                <span className="sk-dot-sep" aria-hidden="true">·</span>
              </>
            )}
            <a
              href="https://shelforia.de/"
              target="_blank"
              rel="noopener noreferrer"
              className="sk-inline-link"
            >
              <span>{copy.hero.flagship}</span>
              <ArrowDownRight size={13} />
            </a>
          </div>

          <div className="sk-hero-meta-strip">
            <span>{copy.hero.workingAt}</span>
            {(profile.languages || []).map((lang) => (
              <span key={lang.name}>
                {getLocalizedText(lang, 'name', locale, lang.name)} {lang.proficiency}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Kinetic Bottom Marquee anchored to viewport bottom */}
      <div className="sk-marquee" dir="ltr" aria-label="Core expertise">
        <div className="sk-marquee-track">
          {[...tickerItems, ...tickerItems].map((label, idx) => (
            <span key={idx} className="sk-marquee-item">
              <span className="sk-marquee-diamond" aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
