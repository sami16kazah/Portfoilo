"use client";

import React, { useState } from 'react';
import { ArrowUpRight, BookOpen, Download, X } from 'lucide-react';
import {
  PORTFOLIO_COPY,
  getBookLibraryLinks,
  getLocalizedText,
  type BookData,
  type Locale,
} from './portfolioCopy';
import { SectionHeader } from './SectionHeader';

interface BooksSectionProps {
  locale: Locale;
  books: BookData[];
}

const BOOK_ACCENTS = ['#6366f1', '#10b981', '#f59e0b'];

export const BooksSection: React.FC<BooksSectionProps> = ({ locale, books }) => {
  const copy = PORTFOLIO_COPY[locale];
  const [activeBook, setActiveBook] = useState<BookData | null>(null);

  if (!books || books.length === 0) return null;

  return (
    <section id="books" className="sk-section sk-section-alt">
      <div className="sk-container">
        <SectionHeader
          code={copy.sections.books.code}
          label={copy.sections.books.label}
          meta={copy.sections.books.meta}
        />

        <div className="sk-section-intro">
          <h2 className="sk-display-h2">
            {copy.books.heading}{' '}
            <span className="sk-brand-highlight">{copy.books.headingAccent}</span>
          </h2>
          <p className="sk-lead">{copy.books.subtitle}</p>
        </div>

        <div className="sk-books-grid">
          {books.map((book, idx) => {
            const title = getLocalizedText(book, 'title', locale, book.title);
            const subtitle = getLocalizedText(book, 'subtitle', locale, book.subtitle || '');
            const desc = getLocalizedText(book, 'description', locale, book.description || '');
            const libs = getBookLibraryLinks(book);
            const accent = BOOK_ACCENTS[idx % BOOK_ACCENTS.length];

            return (
              <article
                key={book._id}
                className="sk-book-card"
                style={{ '--book-accent': accent } as React.CSSProperties}
              >
                <div className="sk-book-cover">
                  <div className="sk-book-spine" aria-hidden="true" />
                  <div className="sk-book-cover-meta">
                    <span className="sk-book-num">VOL. 0{idx + 1}</span>
                    {book.downloadsLabel && (
                      <span className="sk-book-dl">
                        <Download size={11} />
                        {book.downloadsLabel}
                      </span>
                    )}
                  </div>
                  <div className="sk-book-cover-title">
                    <BookOpen size={18} />
                    <strong>{title}</strong>
                  </div>
                </div>

                <div className="sk-book-body">
                  {subtitle && <p className="sk-book-sub">{subtitle}</p>}
                  <p className="sk-book-desc">{desc}</p>

                  {book.topics && book.topics.length > 0 && (
                    <div className="sk-tag-row">
                      {book.topics.map((topic) => (
                        <span key={topic} className="sk-tech-chip">
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="sk-book-actions">
                    {libs[0] && (
                      <a
                        href={libs[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sk-btn sk-btn-primary sk-btn-sm"
                      >
                        <span>
                          {copy.books.openLibrary} {libs[0].name}
                        </span>
                        <ArrowUpRight size={13} />
                      </a>
                    )}
                    <button
                      type="button"
                      className="sk-btn sk-btn-outline sk-btn-sm"
                      onClick={() => setActiveBook(book)}
                    >
                      <span>{copy.books.readSynopsis}</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Book Synopsis Modal */}
        {activeBook && (
          <div
            className="sk-modal-backdrop"
            role="dialog"
            aria-modal="true"
            onClick={() => setActiveBook(null)}
          >
            <div className="sk-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="sk-modal-head">
                <div>
                  <span className="sk-micro-label">{activeBook.downloadsLabel || 'PUBLICATION'}</span>
                  <h3>{getLocalizedText(activeBook, 'title', locale, activeBook.title)}</h3>
                </div>
                <button
                  type="button"
                  className="sk-modal-close"
                  onClick={() => setActiveBook(null)}
                  aria-label={copy.books.close}
                >
                  <X size={18} />
                </button>
              </div>
              <p className="sk-modal-sub">
                {getLocalizedText(activeBook, 'subtitle', locale, activeBook.subtitle || '')}
              </p>
              <p className="sk-modal-body">
                {getLocalizedText(activeBook, 'description', locale, activeBook.description || '')}
              </p>
              <div className="sk-modal-foot">
                {getBookLibraryLinks(activeBook).map((lib) => (
                  <a
                    key={lib.url}
                    href={lib.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sk-btn sk-btn-primary sk-btn-sm"
                  >
                    <span>
                      {copy.books.openLibrary} {lib.name}
                    </span>
                    <ArrowUpRight size={13} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
