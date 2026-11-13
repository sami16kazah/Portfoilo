"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  FaImages,
  FaEnvelope,
  FaPaperPlane,
  FaCopy,
  FaCheck,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaGithub,
  FaLinkedin,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useLocale } from "@/app/context/LocalContext";
import { PhotoData, ProfileData } from "./types";

interface GalleryContactSectionProps {
  photos: PhotoData[];
  profile: ProfileData;
}

export default function GalleryContactSection({
  photos,
  profile,
}: GalleryContactSectionProps) {
  const { t } = useLocale();
  const prefersReducedMotion = useReducedMotion();

  // Lightbox state
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Contact form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const contactEmail = profile.email || "samkazah444@gmail.com";

  useEffect(() => {
    if (lightboxIdx === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowRight") {
        setLightboxIdx((prev) => (prev === null ? null : (prev + 1) % photos.length));
      }
      if (e.key === "ArrowLeft") {
        setLightboxIdx((prev) =>
          prev === null ? null : (prev - 1 + photos.length) % photos.length
        );
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIdx, photos.length]);

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback ignored
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/Email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          service: selectedServices.join(", "),
          budget: selectedBudget,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: "success", text: t.contact.sentSuccess });
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        setSelectedServices([]);
        setSelectedBudget("");
      } else {
        setFeedback({
          type: "error",
          text: data.message || "Could not send right now. Please email directly.",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        text: "Network error. Please use the direct email link instead.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const serviceOptions = ["Full-Stack Web", "Cloud / ERP", "UI/UX & Frontend", "API & Backend"];
  const budgetOptions = ["< €1,000", "€1,000 – €5,000", "€5,000+", "Full-Time / Role"];

  return (
    <>
      {/* Gallery */}
      {photos.length > 0 && (
        <section id="gallery" className="py-24 bg-[#060911] border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12 space-y-2">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-300">
                <FaImages aria-hidden="true" /> {t.gallery.eyebrow}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {t.gallery.heading}
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {photos.map((photo, idx) => (
                <motion.button
                  key={photo._id || idx}
                  type="button"
                  onClick={() => setLightboxIdx(idx)}
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-indigo-400/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <img
                    src={photo.url}
                    alt={photo.title || `Gallery image ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {photo.title && (
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-left">
                      <span className="text-xs font-semibold text-white">{photo.title}</span>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Lightbox Modal */}
          <AnimatePresence>
            {lightboxIdx !== null && photos[lightboxIdx] && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                role="dialog"
                aria-modal="true"
                aria-label={photos[lightboxIdx].title || "Gallery photo preview"}
                className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                onClick={() => setLightboxIdx(null)}
              >
                <div
                  className="relative max-w-4xl w-full rounded-3xl bg-[#0D1322] border border-slate-700 p-3 sm:p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setLightboxIdx(null)}
                    aria-label={t.gallery.close}
                    className="absolute top-5 right-5 z-10 h-10 w-10 rounded-full bg-slate-900/90 border border-slate-700 text-white hover:bg-slate-800 flex items-center justify-center"
                  >
                    <FaTimes />
                  </button>

                  <img
                    src={photos[lightboxIdx].url}
                    alt={photos[lightboxIdx].title || "Preview"}
                    className="w-full max-h-[75vh] object-contain rounded-2xl bg-black"
                  />

                  <div className="flex items-center justify-between pt-3 px-2">
                    <span className="text-sm font-semibold text-white">
                      {photos[lightboxIdx].title || `Photo ${lightboxIdx + 1}`}
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        aria-label="Previous photo"
                        onClick={() =>
                          setLightboxIdx((lightboxIdx - 1 + photos.length) % photos.length)
                        }
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white hover:bg-slate-800"
                      >
                        <FaChevronLeft size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label="Next photo"
                        onClick={() => setLightboxIdx((lightboxIdx + 1) % photos.length)}
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white hover:bg-slate-800"
                      >
                        <FaChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-[#070B14] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-300">
                  <FaEnvelope aria-hidden="true" /> {t.contact.eyebrow}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {t.contact.heading}
                </h2>
                <p className="text-slate-300 text-base leading-relaxed">
                  {t.contact.subtitle}
                </p>
              </div>

              <div className="rounded-2xl bg-[#0D1322] border border-slate-800 p-5 space-y-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Email
                  </div>
                  <div className="text-base font-bold text-white mt-1 break-all">
                    {contactEmail}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={`mailto:${contactEmail}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
                  >
                    <FaEnvelope aria-hidden="true" />
                    <span>{t.contact.directEmail}</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100 text-sm font-semibold transition-colors"
                  >
                    {copied ? <FaCheck className="text-emerald-400" /> : <FaCopy />}
                    <span>{copied ? t.contact.copied : t.contact.copyEmail}</span>
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
                  <span className="inline-flex items-center gap-1.5">
                    <FaMapMarkerAlt className="text-cyan-400" aria-hidden="true" />
                    {t.contact.locationLabel}
                  </span>
                  <div className="flex items-center gap-2">
                    {profile.socialLinks?.github && (
                      <a
                        href={profile.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:text-white"
                      >
                        <FaGithub />
                      </a>
                    )}
                    {profile.socialLinks?.linkedin && (
                      <a
                        href={profile.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:text-white"
                      >
                        <FaLinkedin />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <form
              onSubmit={handleSubmit}
              className="lg:col-span-7 rounded-3xl bg-[#0D1322] border border-slate-700/80 p-6 sm:p-8 space-y-5 shadow-xl"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="space-y-1.5 block">
                  <span className="text-xs font-semibold text-slate-200">{t.contact.name}</span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sami Kazah"
                    className="w-full px-4 py-3 rounded-xl bg-[#070B14] border border-slate-700 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-indigo-400"
                  />
                </label>

                <label className="space-y-1.5 block">
                  <span className="text-xs font-semibold text-slate-200">{t.contact.email}</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#070B14] border border-slate-700 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-indigo-400"
                  />
                </label>
              </div>

              <label className="space-y-1.5 block">
                <span className="text-xs font-semibold text-slate-200">{t.contact.subject}</span>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Project / Collaboration"
                  className="w-full px-4 py-3 rounded-xl bg-[#070B14] border border-slate-700 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-indigo-400"
                />
              </label>

              {/* Services */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-200 block">
                  {t.contact.servicesLabel}
                </span>
                <div className="flex flex-wrap gap-2">
                  {serviceOptions.map((srv) => {
                    const active = selectedServices.includes(srv);
                    return (
                      <button
                        key={srv}
                        type="button"
                        onClick={() => toggleService(srv)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                          active
                            ? "bg-indigo-600 text-white border-indigo-400"
                            : "bg-[#070B14] text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white"
                        }`}
                      >
                        {srv}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scope */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-200 block">
                  {t.contact.budgetLabel}
                </span>
                <div className="flex flex-wrap gap-2">
                  {budgetOptions.map((opt) => {
                    const active = selectedBudget === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedBudget(active ? "" : opt)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                          active
                            ? "bg-emerald-800 text-white border-emerald-400"
                            : "bg-[#070B14] text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="space-y-1.5 block">
                <span className="text-xs font-semibold text-slate-200">{t.contact.message}</span>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.contact.message}
                  className="w-full px-4 py-3 rounded-xl bg-[#070B14] border border-slate-700 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-indigo-400 resize-y"
                />
              </label>

              {feedback && (
                <div
                  role="status"
                  className={`p-3.5 rounded-xl text-sm font-medium border ${
                    feedback.type === "success"
                      ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-200"
                      : "bg-rose-950/90 border-rose-500/50 text-rose-200"
                  }`}
                >
                  {feedback.text}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold shadow-lg shadow-indigo-600/25 transition-all"
              >
                <FaPaperPlane size={14} aria-hidden="true" />
                <span>{submitting ? t.contact.sending : t.contact.send}</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-[#05080F] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-300">
          <p>
            © {new Date().getFullYear()} {profile.name || "Sami Kazah"} ({profile.name_ar || "سامي قزح"}). {t.footer.rights}
          </p>
          <nav aria-label="Language and Crawler Links" className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <Link href="/en" className="hover:text-white underline-offset-4 hover:underline">
              English
            </Link>
            <Link href="/de" className="hover:text-white underline-offset-4 hover:underline">
              Deutsch
            </Link>
            <Link href="/ar" lang="ar" dir="rtl" className="hover:text-white underline-offset-4 hover:underline">
              العربية
            </Link>
            <span className="text-slate-600" aria-hidden="true">|</span>
            <a href="/llms.txt" className="hover:text-white underline-offset-4 hover:underline">
              llms.txt
            </a>
            <a href="/sitemap.xml" className="hover:text-white underline-offset-4 hover:underline">
              sitemap.xml
            </a>
          </nav>
          <p className="text-xs text-slate-400">{t.footer.builtWith}</p>
        </div>
      </footer>
    </>
  );
}
