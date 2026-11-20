"use client";

import React, { useEffect, useRef, useState } from 'react';

interface SectionHeaderProps {
  code: string;
  label: string;
  meta: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ code, label, meta }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`sk-section-header ${visible ? 'is-drawn' : ''}`}>
      <div className="sk-section-bar">
        <div className="sk-section-code-group">
          <span className="sk-section-code">{code}</span>
          <span className="sk-section-slash" aria-hidden="true">/</span>
          <span className="sk-section-label">{label}</span>
        </div>
        <span className="sk-section-meta">{meta}</span>
      </div>
      <div className="sk-section-hairline" aria-hidden="true">
        <span className="sk-section-hairline-fill" />
      </div>
    </div>
  );
};
