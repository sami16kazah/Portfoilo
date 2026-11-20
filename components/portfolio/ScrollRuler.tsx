"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface RulerSection {
  id: string;
  label: string;
}

interface ScrollRulerProps {
  sections: RulerSection[];
  onNavigate: (id: string) => void;
  rtl?: boolean;
}

const TRACK_TOP = 72;
const TRACK_BOTTOM = 24;
const PILE_START_Y = 74;
const PILE_ROW_H = 20;
const QUEUE_ROW_H = 22;
const QUEUE_BOTTOM_PAD = 20;
const ACTIVE_HEADING_OFFSET = 14;
const EDGE_MARGIN = 64;
const CHAR_PITCH_PILE = 7.4;
const CHAR_PITCH_ACTIVE = 12.2;
const CHAR_PITCH_QUEUE = 8.4;
const RAIL_PITCH = 12.6;
const RAIL_X_OFFSET = 62;
const RAIL_ARC_BEND = 26;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const quadBez = (p0: number, p1: number, p2: number, t: number) => {
  const u = 1 - t;
  return u * u * p0 + 2 * u * t * p1 + t * t * p2;
};

interface MeasuredAnchor {
  id: string;
  label: string;
  norm: number;
}

export const ScrollRuler: React.FC<ScrollRulerProps> = ({
  sections,
  onNavigate,
  rtl = false,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [viewportH, setViewportH] = useState(900);
  const [progress, setProgress] = useState(0);
  const [scrollYPos, setScrollYPos] = useState(0);
  const [viewportRatio, setViewportRatio] = useState(0.14);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverNorm, setHoverNorm] = useState<number | null>(null);
  const [anchors, setAnchors] = useState<MeasuredAnchor[]>(() =>
    sections.map((s, idx) => ({
      id: s.id,
      label: s.label,
      norm: idx / Math.max(1, sections.length - 1),
    }))
  );

  const visible = scrollYPos > 140 || isDragging;

  useEffect(() => {
    const check = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      setViewportH(window.innerHeight || 900);
      document.documentElement.dataset.ruler = desktop ? 'on' : 'off';
    };
    check();
    window.addEventListener('resize', check);
    return () => {
      window.removeEventListener('resize', check);
      delete document.documentElement.dataset.ruler;
    };
  }, []);

  const measureAnchors = useCallback(() => {
    const docH = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    setViewportRatio(
      Math.max(
        0.05,
        Math.min(
          0.45,
          window.innerHeight / Math.max(window.innerHeight, document.documentElement.scrollHeight)
        )
      )
    );
    const measured: MeasuredAnchor[] = sections.map((sec, idx) => {
      if (idx === 0) return { id: sec.id, label: sec.label, norm: 0 };
      const el = document.getElementById(sec.id);
      if (!el)
        return {
          id: sec.id,
          label: sec.label,
          norm: idx / Math.max(1, sections.length - 1),
        };
      const top = Math.max(0, el.offsetTop - 96);
      return { id: sec.id, label: sec.label, norm: clamp01(top / docH) };
    });
    setAnchors(measured);
  }, [sections]);

  useEffect(() => {
    let rafId = 0;
    const sync = () => {
      rafId = 0;
      const y = window.scrollY;
      const docH = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setScrollYPos(y);
      setProgress(clamp01(y / docH));
    };
    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(sync);
    };
    sync();
    measureAnchors();
    const t1 = window.setTimeout(measureAnchors, 400);
    const t2 = window.setTimeout(measureAnchors, 1200);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measureAnchors);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measureAnchors);
    };
  }, [measureAnchors]);

  const scrollToNorm = useCallback((norm: number, smooth = false) => {
    const clamped = clamp01(norm);
    const docH = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    window.scrollTo({ top: Math.round(clamped * docH), behavior: smooth ? 'smooth' : 'auto' });
  }, []);

  const normFromClientY = useCallback((clientY: number) => {
    const el = trackRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const usableTop = rect.top + TRACK_TOP;
    const usableH = Math.max(1, rect.height - TRACK_TOP - TRACK_BOTTOM);
    return clamp01((clientY - usableTop) / usableH);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    const n = normFromClientY(e.clientY);
    setHoverNorm(n);
    scrollToNorm(n, false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const n = normFromClientY(e.clientY);
    setHoverNorm(n);
    if (isDragging) scrollToNorm(n, false);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  const activeIndex = useMemo(() => {
    let idx = 0;
    for (let i = 0; i < anchors.length; i++) {
      if (progress + 0.015 >= anchors[i].norm) idx = i;
    }
    return idx;
  }, [anchors, progress]);

  const hoveredSection = useMemo(() => {
    if (hoverNorm === null) return null;
    let idx = 0;
    for (let i = 0; i < anchors.length; i++) {
      if (hoverNorm + 0.015 >= anchors[i].norm) idx = i;
    }
    return anchors[idx] || null;
  }, [anchors, hoverNorm]);

  const ticks = useMemo(() => Array.from({ length: 51 }, (_, i) => i * 2), []);

  const pct = Math.round(progress * 100);
  const d0 = Math.floor(pct / 100);
  const d1 = Math.floor((pct % 100) / 10);
  const d2 = pct % 10;

  const usableH = Math.max(200, viewportH - TRACK_TOP - TRACK_BOTTOM);
  const needleY = TRACK_TOP + progress * usableH;
  const hoverY = hoverNorm !== null ? TRACK_TOP + hoverNorm * usableH : null;
  const bracketH = Math.max(26, viewportRatio * usableH);
  const bracketTop = TRACK_TOP + progress * Math.max(0, usableH - bracketH);

  const kineticWords = useMemo(() => {
    if (!isDesktop) return [];
    const totalSections = anchors.length;
    const queueBottomY = viewportH - QUEUE_BOTTOM_PAD;

    return anchors.map((anchor, sIdx) => {
      const nextNorm = sIdx < totalSections - 1 ? anchors[sIdx + 1].norm : 1.06;
      const bandSpan = Math.max(0.055, nextNorm - anchor.norm);
      const enterStart = Math.max(0, anchor.norm - bandSpan * 0.55);
      const enterEnd = anchor.norm;
      const enterProgress = sIdx === 0 ? 1 : smoothstep(enterStart, enterEnd, progress);
      const exitStart = nextNorm - bandSpan * 0.3;
      const exitEnd = nextNorm;
      const exitProgress = sIdx === totalSections - 1 ? 0 : smoothstep(exitStart, exitEnd, progress);

      const pileY = PILE_START_Y + sIdx * PILE_ROW_H;
      const activeY = PILE_START_Y + activeIndex * PILE_ROW_H + ACTIVE_HEADING_OFFSET;
      const queueRankFromBottom = Math.max(0, totalSections - 1 - sIdx);
      const queueY = queueBottomY - queueRankFromBottom * QUEUE_ROW_H;

      const isCurrent = sIdx === activeIndex;
      const isPassed = sIdx < activeIndex;

      // Whole-word kinetic arc for RTL Arabic (preserves cursive Arabic shaping cleanly)
      if (rtl) {
        let x = EDGE_MARGIN;
        let y = queueY;
        let scale = 0.86;
        let opacity = 0.32;

        if (enterProgress <= 0.001) {
          y = queueY;
          scale = 0.86;
          opacity = isHovering || isDragging ? 0.62 : 0.3;
        } else if (enterProgress < 0.999) {
          const t = enterProgress;
          const ctrlX = EDGE_MARGIN + RAIL_ARC_BEND * Math.sin(t * Math.PI);
          x = quadBez(EDGE_MARGIN, ctrlX, EDGE_MARGIN, t);
          y = quadBez(queueY, lerp(queueY, activeY, 0.5), activeY, t);
          scale = lerp(0.86, 1.24, t);
          opacity = lerp(0.35, 1, smoothstep(0, 0.65, t));
        } else if (exitProgress > 0.001) {
          const t = exitProgress;
          x = EDGE_MARGIN + 8 * Math.sin(t * Math.PI);
          y = lerp(activeY, pileY, t);
          scale = lerp(1.24, 0.82, t);
          opacity = lerp(1, isHovering || isDragging ? 0.62 : 0.34, t);
        } else {
          y = activeY;
          scale = 1.24;
          opacity = 1;
        }

        return {
          id: anchor.id,
          label: anchor.label,
          isCurrent,
          isPassed,
          rtlWord: { x, y, scale, opacity },
          letters: [],
          hitY: isPassed ? pileY : isCurrent ? activeY : queueY,
          hitW: 112,
        };
      }

      const chars = anchor.label.split('');
      const charCount = chars.length;

      const letters = chars.map((ch, cIdx) => {
        const idxFromRight = charCount - 1 - cIdx;
        const charFrac = charCount > 1 ? cIdx / (charCount - 1) : 0;

        const qX = -(EDGE_MARGIN + idxFromRight * CHAR_PITCH_QUEUE);
        const qY = queueY;
        const aX = -(EDGE_MARGIN + idxFromRight * CHAR_PITCH_ACTIVE);
        const aY = activeY;
        const pX = -(EDGE_MARGIN + idxFromRight * CHAR_PITCH_PILE);
        const pY = pileY;

        let x = qX;
        let y = qY;
        let rot = 0;
        let scale = 0.72;
        let opacity = 0.28;

        if (enterProgress <= 0.001) {
          x = qX;
          y = qY;
          scale = 0.72;
          opacity = isHovering || isDragging ? 0.56 : 0.26;
        } else if (enterProgress < 0.999) {
          const stagger = charFrac * 0.36;
          const t = clamp01((enterProgress - stagger) / (1 - 0.36));
          const railMidY = lerp(qY, aY, 0.52) + (cIdx - (charCount - 1) / 2) * RAIL_PITCH * 0.5;
          const railCtrlX = -(RAIL_X_OFFSET + RAIL_ARC_BEND * Math.sin(t * Math.PI));

          x = quadBez(qX, railCtrlX, aX, t);
          y = quadBez(qY, railMidY, aY, t);
          rot = -86 * Math.sin(t * Math.PI) * (1 - 0.15 * charFrac);
          scale = lerp(0.72, 1.38, t);
          opacity = lerp(0.32, 1, smoothstep(0, 0.65, t));
        } else if (exitProgress > 0.001) {
          const stagger = (1 - charFrac) * 0.28;
          const t = clamp01((exitProgress - stagger) / (1 - 0.28));
          const ctrlX = lerp(aX, pX, 0.5) - 10 * Math.sin(t * Math.PI);
          const ctrlY = lerp(aY, pY, 0.5) - 6 * Math.sin(t * Math.PI);
          x = quadBez(aX, ctrlX, pX, t);
          y = quadBez(aY, ctrlY, pY, t);
          rot = -12 * Math.sin(t * Math.PI);
          scale = lerp(1.38, 0.68, t);
          opacity = lerp(1, isHovering || isDragging ? 0.58 : 0.32, t);
        } else {
          x = aX;
          y = aY;
          rot = 0;
          scale = 1.38;
          opacity = 1;
        }

        return { ch, x, y, rot, scale, opacity };
      });

      const hitY = isPassed ? pileY : isCurrent ? activeY : queueY;
      const hitW = charCount * (isCurrent ? CHAR_PITCH_ACTIVE : CHAR_PITCH_QUEUE) + 18;

      return {
        id: anchor.id,
        label: anchor.label,
        isCurrent,
        isPassed,
        rtlWord: null,
        letters,
        hitY,
        hitW,
      };
    });
  }, [anchors, activeIndex, isDesktop, isDragging, isHovering, progress, rtl, viewportH]);

  if (!isDesktop) return null;

  return (
    <div className={`sk-ruler-shell ${visible ? 'is-visible' : ''} ${rtl ? 'is-rtl' : ''}`}>
      <div className="sk-ruler-kinetic-layer" aria-hidden="true">
        {kineticWords.map((word) => (
          <div key={word.id} className="sk-ruler-word-group">
            <button
              type="button"
              className="sk-ruler-word-hit"
              style={
                rtl
                  ? {
                      top: `${word.hitY - 11}px`,
                      left: `${EDGE_MARGIN - 8}px`,
                      width: `${word.hitW}px`,
                    }
                  : {
                      top: `${word.hitY - 11}px`,
                      right: `${EDGE_MARGIN - 8}px`,
                      width: `${word.hitW}px`,
                    }
              }
              onClick={() => onNavigate(word.id)}
              title={word.label}
              aria-label={word.label}
            />

            {word.rtlWord ? (
              <span
                className={`sk-ruler-word-rtl ${word.isCurrent ? 'is-current' : ''}`}
                style={{
                  transform: `translate3d(${word.rtlWord.x}px, ${word.rtlWord.y}px, 0) scale(${word.rtlWord.scale})`,
                  opacity: word.rtlWord.opacity,
                }}
              >
                {word.label}
              </span>
            ) : (
              word.letters.map((l, cIdx) => (
                <span
                  key={cIdx}
                  className={`sk-ruler-letter ${word.isCurrent ? 'is-current' : ''}`}
                  style={{
                    transform: `translate3d(${l.x}px, ${l.y}px, 0) rotate(${l.rot}deg) scale(${l.scale})`,
                    opacity: l.opacity,
                  }}
                >
                  {l.ch === ' ' ? '\u00A0' : l.ch}
                </span>
              ))
            )}
          </div>
        ))}
      </div>

      <div
        ref={trackRef}
        className={`sk-scroll-ruler ${isHovering ? 'is-active' : ''} ${isDragging ? 'is-dragging' : ''}`}
        role="slider"
        aria-label="Page scroll ruler"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        tabIndex={0}
        onPointerEnter={() => setIsHovering(true)}
        onPointerLeave={() => {
          setIsHovering(false);
          if (!isDragging) setHoverNorm(null);
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            scrollToNorm(progress + 0.08, true);
          } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            scrollToNorm(progress - 0.08, true);
          } else if (e.key === 'Home') {
            e.preventDefault();
            scrollToNorm(0, true);
          } else if (e.key === 'End') {
            e.preventDefault();
            scrollToNorm(1, true);
          }
        }}
      >
        <div className="sk-ruler-spine" aria-hidden="true" />

        <div className="sk-ruler-ticks" aria-hidden="true">
          {ticks.map((val) => {
            const y = TRACK_TOP + (val / 100) * usableH;
            const isMajor = val % 10 === 0;
            return (
              <div
                key={val}
                className={`sk-ruler-tick ${isMajor ? 'is-major' : ''}`}
                style={{ transform: `translateY(${y}px)` }}
              >
                <span className="sk-ruler-tick-line" />
                {isMajor && <span className="sk-ruler-tick-num">{val}</span>}
              </div>
            );
          })}
        </div>

        <div className="sk-ruler-anchors" aria-hidden="true">
          {anchors.map((a, i) => {
            const y = TRACK_TOP + a.norm * usableH;
            const isPassed = i <= activeIndex;
            return (
              <div
                key={a.id}
                className={`sk-ruler-anchor ${isPassed ? 'is-passed' : ''}`}
                style={{ transform: `translateY(${y}px)` }}
              >
                <span className="sk-ruler-anchor-dot" />
              </div>
            );
          })}
        </div>

        <div
          className="sk-ruler-viewport-bracket"
          style={{
            transform: `translateY(${bracketTop}px)`,
            height: `${bracketH}px`,
          }}
          aria-hidden="true"
        />

        {hoverY !== null && hoveredSection && (isHovering || isDragging) && (
          <div className="sk-ruler-ghost" style={{ transform: `translateY(${hoverY}px)` }}>
            <span className="sk-ruler-ghost-line" />
            <span className="sk-ruler-ghost-pill">
              <strong>{hoveredSection.label}</strong>
              <em dir="ltr">{Math.round((hoverNorm ?? 0) * 100)}%</em>
            </span>
          </div>
        )}

        <div className="sk-ruler-needle" style={{ transform: `translateY(${needleY}px)` }}>
          <span className="sk-ruler-needle-line" />
          <div className="sk-ruler-odometer" dir="ltr" aria-hidden="true">
            {[d0, d1, d2].map((digit, idx) => (
              <span key={idx} className="sk-odo-col">
                <span
                  className="sk-odo-strip"
                  style={{ transform: `translateY(-${digit * 11}px)` }}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <span key={n} className="sk-odo-digit">
                      {n}
                    </span>
                  ))}
                </span>
              </span>
            ))}
            <span className="sk-odo-pct">%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
