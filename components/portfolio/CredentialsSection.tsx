"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  FaGraduationCap,
  FaCertificate,
  FaBook,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { useLocale } from "@/app/context/LocalContext";
import {
  BookData,
  CertificationData,
  EducationData,
  getLocalizedText,
} from "./types";

interface CredentialsSectionProps {
  education: EducationData[];
  certifications: CertificationData[];
  books: BookData[];
}

export default function CredentialsSection({
  education,
  certifications,
  books,
}: CredentialsSectionProps) {
  const { locale, t } = useLocale();
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      {(education.length > 0 || certifications.length > 0) && (
        <section id="education" className="py-24 bg-[#060911] border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12 space-y-2">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-300">
                <FaGraduationCap aria-hidden="true" /> {t.education.eyebrow}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {t.education.heading}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Education Timeline */}
              {education.length > 0 && (
                <div className="lg:col-span-7 space-y-5">
                  {education.map((edu, idx) => (
                    <motion.article
                      key={edu._id || idx}
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ duration: 0.35, delay: idx * 0.08 }}
                      className="rounded-2xl bg-[#0D1322] border border-slate-800 hover:border-amber-400/50 p-6 transition-colors"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                        <h3 className="text-lg font-bold text-white">
                          {getLocalizedText(edu, "degree", locale, edu.degree)}
                        </h3>
                        {edu.year && (
                          <span className="px-3 py-1 rounded-full bg-amber-950 border border-amber-500/40 text-amber-200 text-xs font-bold">
                            {edu.year}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-amber-300 flex items-center gap-2 mb-2">
                        <FaGraduationCap aria-hidden="true" />
                        <span>{getLocalizedText(edu, "institution", locale, edu.institution)}</span>
                      </p>
                      {edu.description && (
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {getLocalizedText(edu, "description", locale, edu.description)}
                        </p>
                      )}
                    </motion.article>
                  ))}
                </div>
              )}

              {/* Certifications */}
              {certifications.length > 0 && (
                <div className="lg:col-span-5 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                    {t.education.certHeading}
                  </h3>
                  {certifications.map((cert, idx) => (
                    <motion.div
                      key={cert._id || idx}
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ duration: 0.35, delay: idx * 0.08 }}
                      className="rounded-2xl bg-[#0D1322] border border-slate-800 hover:border-cyan-400/50 p-5 space-y-3 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span className="h-10 w-10 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shrink-0">
                            <FaCertificate aria-hidden="true" />
                          </span>
                          <div>
                            <h4 className="font-bold text-white text-base">
                              {getLocalizedText(cert, "name", locale, cert.name)}
                            </h4>
                            <p className="text-xs text-slate-300 mt-0.5">{cert.issuer}</p>
                          </div>
                        </div>
                        {cert.date && (
                          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200">
                            {cert.date}
                          </span>
                        )}
                      </div>
                      {cert.link && (
                        <a
                          href={cert.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-cyan-200"
                        >
                          <span>{t.education.viewCert}</span>
                          <FaExternalLinkAlt size={10} aria-hidden="true" />
                        </a>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Published Books */}
      {books.length > 0 && (
        <section id="books" className="py-24 bg-[#070B14] border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12 space-y-2">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-300">
                <FaBook aria-hidden="true" /> {t.books.eyebrow}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {t.books.heading}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {books.map((book, idx) => {
                const bookTitle = getLocalizedText(book, "title", locale, book.title);
                const bookDesc = getLocalizedText(book, "description", locale, book.description || "");
                return (
                  <motion.article
                    key={book._id || idx}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.35, delay: idx * 0.08 }}
                    className="rounded-2xl bg-[#0D1322] border border-slate-800 hover:border-cyan-400/50 p-6 flex flex-col justify-between gap-5 transition-colors"
                  >
                    <div className="space-y-4">
                      {book.coverUrl ? (
                        <div className="h-44 rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                          <img
                            src={book.coverUrl}
                            alt={bookTitle}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center">
                          <FaBook size={20} aria-hidden="true" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-bold text-white">{bookTitle}</h3>
                        <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                          {bookDesc}
                        </p>
                      </div>
                    </div>

                    {book.link && (
                      <a
                        href={book.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200 pt-3 border-t border-slate-800"
                      >
                        <span>{t.books.readMore}</span>
                        <FaExternalLinkAlt size={11} aria-hidden="true" />
                      </a>
                    )}
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

