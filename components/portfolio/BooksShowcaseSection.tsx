"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FaBook, FaExternalLinkAlt, FaGlobe } from "react-icons/fa";
import { useLocale } from "@/app/context/LocalContext";
import {
  BookData,
  getBookLibraryLinks,
  getLocalizedText,
  inferLibraryName,
} from "./types";

interface BooksShowcaseSectionProps {
  books: BookData[];
}

function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return inferLibraryName(url);
  }
}

export default function BooksShowcaseSection({ books }: BooksShowcaseSectionProps) {
  const { locale, t } = useLocale();
  const prefersReducedMotion = useReducedMotion();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const safeBooks = books || [];
  const activeBook = safeBooks[selectedIndex] || safeBooks[0];

  useEffect(() => {
    setExpanded(false);
  }, [selectedIndex]);

  if (!activeBook) return null;

  const title = getLocalizedText(activeBook, "title", locale, activeBook.title);
  const subtitle = getLocalizedText(activeBook, "subtitle", locale, activeBook.subtitle || "");
  const description = getLocalizedText(
    activeBook,
    "description",
    locale,
    activeBook.description || ""
  );
  const libraryLinks = getBookLibraryLinks(activeBook);
  const isLongDescription = description.length > 680;
  const displayedDescription =
    isLongDescription && !expanded
      ? `${description.slice(0, 680).trimEnd()}...`
      : description;

  return (
    <section id="books" className="py-24 bg-[#070B14] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mb-10 space-y-2.5"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.books.heading}
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            {t.books.subtitle}
          </p>
        </motion.div>

        {/* Interactive Book Selector Pills */}
        <div
          role="tablist"
          aria-label="Select published book"
          className="flex flex-wrap gap-3 mb-8"
        >
          {safeBooks.map((book, idx) => {
            const bookTitle = getLocalizedText(book, "title", locale, book.title);
            const active = idx === selectedIndex;
            const linksCount = getBookLibraryLinks(book).length;

            return (
              <button
                key={book._id || idx}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedIndex(idx)}
                className={`relative px-4 py-2.5 rounded-2xl text-sm font-bold transition-colors border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  active
                    ? "text-white border-cyan-400/70"
                    : "bg-[#0D1322] text-slate-300 border-slate-800 hover:border-slate-600 hover:text-white"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="activeBookPill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-2xl bg-[#132238] border border-cyan-500/40 -z-0"
                  />
                )}
                <span className="relative z-10 flex items-center gap-2.5">
                  {book.coverUrl ? (
                    <img
                      src={book.coverUrl}
                      alt=""
                      className="h-6 w-8 rounded object-cover border border-slate-700/70 shrink-0"
                    />
                  ) : (
                    <FaBook className="text-cyan-300 shrink-0" size={14} aria-hidden="true" />
                  )}
                  <span dir="auto" className="truncate max-w-[220px]">
                    {bookTitle}
                  </span>
                  {linksCount > 0 && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-900/90 text-slate-300 border border-slate-700/70">
                      {linksCount}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Book Stage */}
        <AnimatePresence mode="wait">
          <motion.article
            key={activeBook._id || selectedIndex}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl bg-[#0D1322] border border-slate-700/80 overflow-hidden shadow-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Column: Cover Art + Multi-Library Publishing Dock */}
              <div className="lg:col-span-5 p-5 sm:p-7 bg-[#080C17] border-b lg:border-b-0 lg:border-e border-slate-800 flex flex-col justify-between gap-6">
                {/* Cover Container */}
                <div className="rounded-2xl overflow-hidden border border-slate-700/80 bg-[#0D1322] shadow-lg">
                  {activeBook.coverUrl ? (
                    <div className="aspect-video w-full bg-slate-950 overflow-hidden">
                      <img
                        src={activeBook.coverUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full p-6 bg-gradient-to-br from-[#0F1B2E] via-[#0B1320] to-[#080C17] flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="h-10 w-10 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center">
                          <FaBook size={18} aria-hidden="true" />
                        </span>
                        {activeBook.downloadsLabel && (
                          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200">
                            {activeBook.downloadsLabel}
                          </span>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div dir="auto" className="text-lg font-extrabold text-white line-clamp-2">
                          {title}
                        </div>
                        <div className="text-xs font-medium text-cyan-300">Sami Kazah</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Published Libraries Dock */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {t.books.publishedAt}
                    </h4>
                    <span className="text-xs text-slate-400">
                      {libraryLinks.length}{" "}
                      {libraryLinks.length === 1
                        ? t.books.librarySingular
                        : t.books.libraryPlural}
                    </span>
                  </div>

                  {libraryLinks.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                      {libraryLinks.map((lib, libIdx) => (
                        <a
                          key={`${lib.url}-${libIdx}`}
                          href={lib.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group rounded-xl bg-[#0D1322] hover:bg-[#131C31] border border-slate-700/80 hover:border-cyan-400/60 px-4 py-3 flex items-center justify-between gap-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 flex items-center justify-center shrink-0">
                              <FaGlobe size={13} aria-hidden="true" />
                            </span>
                            <div className="min-w-0">
                              <div className="text-sm font-bold text-white truncate">
                                {lib.name}
                              </div>
                              <div className="text-[11px] font-mono text-slate-400 truncate">
                                {getHostname(lib.url)}
                              </div>
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 group-hover:text-cyan-200 shrink-0">
                            <span>{t.books.openLibrary}</span>
                            <FaExternalLinkAlt size={10} aria-hidden="true" />
                          </span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 rounded-xl bg-[#0D1322] border border-slate-800 p-3">
                      {t.books.noLibraries}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column: Editorial Long-Description Reader */}
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <h3
                        dir="auto"
                        className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
                      >
                        {title}
                      </h3>
                      {subtitle && (
                        <p dir="auto" className="text-sm sm:text-base font-semibold text-cyan-300">
                          {subtitle}
                        </p>
                      )}
                    </div>
                    {activeBook.downloadsLabel && (
                      <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 whitespace-nowrap">
                        {activeBook.downloadsLabel}
                      </span>
                    )}
                  </div>

                  {activeBook.topics && activeBook.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {activeBook.topics.map((topic, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-xs font-medium text-slate-200"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Full formatted synopsis */}
                  <div className="rounded-2xl bg-[#080C17] border border-slate-800/90 p-5 sm:p-6 space-y-3">
                    <p
                      dir="auto"
                      className="text-slate-200 text-sm sm:text-base leading-8 whitespace-pre-line max-w-prose"
                    >
                      {displayedDescription}
                    </p>

                    {isLongDescription && (
                      <button
                        type="button"
                        onClick={() => setExpanded((prev) => !prev)}
                        className="text-xs font-bold text-cyan-300 hover:text-cyan-200 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
                      >
                        {expanded ? t.books.readLess : t.books.readMore}
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Library Buttons Footer */}
                {libraryLinks.length > 0 && (
                  <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-2.5">
                    {libraryLinks.map((lib, libIdx) => (
                      <a
                        key={`cta-${lib.url}-${libIdx}`}
                        href={lib.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                          libIdx === 0
                            ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                            : "bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100"
                        }`}
                      >
                        <span>{lib.name}</span>
                        <FaExternalLinkAlt size={11} aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.article>
        </AnimatePresence>

        {/* Bottom Uniform Library Index Cards */}
        {safeBooks.length > 1 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
            {safeBooks.map((book, idx) => {
              const bookTitle = getLocalizedText(book, "title", locale, book.title);
              const bookDesc = getLocalizedText(book, "description", locale, book.description || "");
              const active = idx === selectedIndex;
              const links = getBookLibraryLinks(book);

              return (
                <motion.button
                  key={book._id || idx}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                  className={`text-start rounded-2xl p-4 sm:p-5 border transition-all flex flex-col justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    active
                      ? "bg-[#121C30] border-cyan-400/70"
                      : "bg-[#0D1322] border-slate-800 hover:border-slate-600"
                  }`}
                >
                  <div className="space-y-3 w-full">
                    <div className="flex items-center gap-3">
                      {book.coverUrl ? (
                        <img
                          src={book.coverUrl}
                          alt=""
                          className="h-12 w-16 rounded-lg object-cover border border-slate-700 shrink-0"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 flex items-center justify-center shrink-0">
                          <FaBook size={16} aria-hidden="true" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div dir="auto" className="text-base font-bold text-white line-clamp-1">
                          {bookTitle}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {links.length}{" "}
                          {links.length === 1 ? t.books.librarySingular : t.books.libraryPlural}
                        </div>
                      </div>
                    </div>

                    <p dir="auto" className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                      {bookDesc}
                    </p>
                  </div>

                  <div className="w-full flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs font-semibold text-cyan-300">
                    <span>{t.books.inspectBook}</span>
                    <span>→</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

