"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  AutoAwesome as SparklesIcon,
  CheckCircle as CheckIcon,
  CloudQueue as CloudIcon,
  Code as ProjectIcon,
  Edit as EditIcon,
  MenuBook as BookIcon,
  OpenInNew as OpenIcon,
  Person as PersonIcon,
  PhotoLibrary as PhotoIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  School as EducationIcon,
  Shield as ShieldIcon,
  Sync as SyncIcon,
  Verified as CertIcon,
  Visibility as EyeIcon,
  Work as JobIcon,
} from "@mui/icons-material";
import type { ProfileData, SiteSettingsData } from "@/components/portfolio/types";

interface SecurityDiagnosticsObject {
  hasAuthSecret?: boolean;
  cloudinarySecretNonPublic?: boolean;
  cloudinarySecretLegacyPublic?: boolean;
  hasDatabaseUri?: boolean;
  hasSetupToken?: boolean;
  hasMailjet?: boolean;
  isProduction?: boolean;
}

interface SecurityAuditItem {
  label: string;
  ok: boolean;
  detail: string;
}

function buildSecurityAuditList(security?: OverviewPayload["security"] | null): SecurityAuditItem[] {
  const raw = security?.diagnostics;
  if (Array.isArray(raw)) return raw;

  const diag = (raw || {}) as SecurityDiagnosticsObject;
  return [
    {
      label: "Setup Route Lock",
      ok: Boolean(security?.setupLocked),
      detail: security?.setupLocked
        ? "Locked permanently after admin initialization."
        : "No admin account locked yet.",
    },
    {
      label: "Auth Signing Secret",
      ok: Boolean(diag.hasAuthSecret),
      detail: diag.hasAuthSecret
        ? "Configured securely in server environment."
        : "Set AUTH_SECRET in Vercel environment variables.",
    },
    {
      label: "MongoDB Connection",
      ok: Boolean(diag.hasDatabaseUri),
      detail: diag.hasDatabaseUri
        ? "MONGODB_URI configured on server."
        : "Missing MONGODB_URI environment variable.",
    },
    {
      label: "Cloudinary API Secret",
      ok: Boolean(diag.cloudinarySecretNonPublic),
      detail: diag.cloudinarySecretNonPublic
        ? "Stored in server-only CLOUDINARY_API_SECRET."
        : diag.cloudinarySecretLegacyPublic
        ? "Using NEXT_PUBLIC_ fallback; switch to CLOUDINARY_API_SECRET."
        : "Optional media signing secret not set.",
    },
    {
      label: "Setup Token Guard",
      ok: Boolean(diag.hasSetupToken),
      detail: diag.hasSetupToken
        ? "ADMIN_SETUP_TOKEN is active."
        : "Setup relies on first-user lock; ADMIN_SETUP_TOKEN optional.",
    },
    {
      label: "Contact Mailer (Mailjet)",
      ok: Boolean(diag.hasMailjet),
      detail: diag.hasMailjet
        ? "Mailjet API credentials configured."
        : "Configure Mailjet keys to send contact emails.",
    },
  ];
}

interface OverviewPayload {
  autoSynced?: number;
  counts: {
    profile: number;
    jobs: number;
    projects: number;
    skills: number;
    books: number;
    education: number;
    certifications: number;
    photos: number;
  };
  missingDefaults: Record<string, number>;
  profile: ProfileData;
  siteSettings: SiteSettingsData;
  skillBreakdown: Record<string, number>;
  previews: {
    jobs: Array<{
      _id: string;
      company: string;
      role: string;
      startDate?: string;
      endDate?: string;
      isCurrent?: boolean;
      companyUrl?: string;
      logoUrl?: string;
    }>;
    projects: Array<{
      _id: string;
      title: string;
      subtitle?: string;
      demoUrl?: string;
      featured?: boolean;
      logoUrl?: string;
      tags?: string[];
    }>;
    skills: Array<{
      _id: string;
      name: string;
      category: string;
      proficiency?: number;
    }>;
    books: Array<{
      _id: string;
      title: string;
      subtitle?: string;
      coverUrl?: string;
      downloadsLabel?: string;
      libraryCount: number;
    }>;
    education: Array<{
      _id: string;
      degree: string;
      institution: string;
      year?: string;
    }>;
    certifications: Array<{
      _id: string;
      name: string;
      issuer: string;
      date?: string;
    }>;
    photos: Array<{
      _id: string;
      url: string;
      title?: string;
      category?: string;
    }>;
  };
  security: {
    adminEmail: string;
    setupLocked: boolean;
    diagnostics: SecurityDiagnosticsObject | SecurityAuditItem[];
  };
}

const SECTION_SWITCHES: {
  key: keyof SiteSettingsData;
  label: string;
  hint: string;
}[] = [
  { key: "showExperienceSection", label: "Experience & Roles", hint: "Work history timeline" },
  { key: "showPerformanceTelemetry", label: "Runtime Telemetry Panel", hint: "FPS / FCP / AWS flow widget" },
  { key: "showProjectsSection", label: "Projects Showcase", hint: "Interactive project stage" },
  { key: "showSkillsSection", label: "Skills & Cloud Stack", hint: "AWS & tech stack filter" },
  { key: "showEducationSection", label: "Education & Certificates", hint: "Degrees & verified certs" },
  { key: "showBooksSection", label: "Published Books Stage", hint: "Synopsis & multi-library links" },
  { key: "showGallerySection", label: "Photo Gallery", hint: "Lightbox gallery band" },
  { key: "showContactSection", label: "Contact Studio & Footer", hint: "Inquiry form & direct email" },
];

export default function DashboardOverviewClient() {
  const [data, setData] = useState<OverviewPayload | null>(null);
  const [settingsForm, setSettingsForm] = useState<SiteSettingsData | null>(null);
  const [newTopic, setNewTopic] = useState("");
  const [newScope, setNewScope] = useState("");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [revalidating, setRevalidating] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [banner, setBanner] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadOverview = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/overview", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load overview");
      const json: OverviewPayload = await res.json();
      setData(json);
      setSettingsForm(json.siteSettings);
    } catch {
      setBanner({ type: "error", text: "Could not load portfolio overview metrics." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const handleSyncDefaults = async () => {
    setSyncing(true);
    setBanner(null);
    try {
      const res = await fetch("/api/migrate", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Sync failed");
      setBanner({ type: "success", text: json.message || "Defaults synced cleanly." });
      await loadOverview();
    } catch (err) {
      setBanner({
        type: "error",
        text: err instanceof Error ? err.message : "Sync failed.",
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleRevalidate = async () => {
    setRevalidating(true);
    setBanner(null);
    try {
      const res = await fetch("/api/admin/overview", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Revalidation failed");
      setBanner({ type: "success", text: json.message || "Live portfolio cache updated." });
    } catch (err) {
      setBanner({
        type: "error",
        text: err instanceof Error ? err.message : "Revalidation failed.",
      });
    } finally {
      setRevalidating(false);
    }
  };

  const handleSaveSiteSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!settingsForm) return;
    setSavingSettings(true);
    setBanner(null);

    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsForm),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save site settings");
      setSettingsForm(json);
      setBanner({
        type: "success",
        text: "Dynamic portfolio hero, contact options & section visibility updated live!",
      });
    } catch (err) {
      setBanner({
        type: "error",
        text: err instanceof Error ? err.message : "Save failed.",
      });
    } finally {
      setSavingSettings(false);
    }
  };

  const addChip = (field: "serviceOptions" | "budgetOptions", value: string, clear: () => void) => {
    const clean = value.trim();
    if (!clean || !settingsForm) return;
    const current = settingsForm[field] || [];
    if (!current.includes(clean)) {
      setSettingsForm({ ...settingsForm, [field]: [...current, clean] });
    }
    clear();
  };

  const removeChip = (field: "serviceOptions" | "budgetOptions", target: string) => {
    if (!settingsForm) return;
    setSettingsForm({
      ...settingsForm,
      [field]: (settingsForm[field] || []).filter((item) => item !== target),
    });
  };

  if (loading || !data || !settingsForm) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-3 text-slate-400">
        <CircularProgress size={34} />
        <span className="text-sm font-medium">Loading live portfolio studio...</span>
      </div>
    );
  }

  const totalMissing = Object.values(data.missingDefaults || {}).reduce((acc, n) => acc + n, 0);
  const currentJob = data.previews.jobs.find((j) => j.isCurrent) || data.previews.jobs[0];
  const featuredProject =
    data.previews.projects.find((p) => p.featured) || data.previews.projects[0];
  const securityItems = buildSecurityAuditList(data.security);
  const secPassing = securityItems.filter((d) => d.ok).length;
  const secTotal = securityItems.length;

  return (
    <div className="space-y-8">
      {/* Top Studio Header Mirroring Live Portfolio */}
      <section className="rounded-3xl bg-[#0D1322] border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          {/* Identity Mirror */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <img
              src={data.profile.avatarUrl || "/assets/images/sami.jpg"}
              alt={data.profile.name || "Sami Kazah"}
              className="h-20 w-20 rounded-2xl object-cover object-top border-2 border-emerald-500/40 shrink-0 shadow-lg"
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
                  <SparklesIcon sx={{ fontSize: 13 }} /> Live Portfolio Studio
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#060A14] border border-slate-800 text-slate-300 text-[11px] font-medium">
                  {settingsForm.heroBadge || "Software Engineer"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {data.profile.name || "Sami Kazah"}
                {data.profile.name_ar && (
                  <span className="text-slate-400 font-semibold text-xl ms-3" dir="rtl">
                    {data.profile.name_ar}
                  </span>
                )}
              </h1>
              <p className="text-sm text-cyan-300 font-medium">
                {data.profile.title || "Software & Full-Stack Engineer"}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {currentJob && (
                  <Link
                    href="/admin/jobs"
                    className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#070B14] border border-slate-800 hover:border-cyan-400/50 text-xs text-slate-200 transition-colors"
                  >
                    {currentJob.logoUrl && (
                      <img src={currentJob.logoUrl} alt="" className="h-4 w-auto object-contain" />
                    )}
                    <span>{currentJob.company}</span>
                  </Link>
                )}
                {featuredProject && (
                  <Link
                    href="/admin/projects"
                    className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#162B25] border border-emerald-700/60 hover:border-amber-300/60 text-xs text-[#F5EBDD] transition-colors"
                  >
                    {featuredProject.logoUrl && (
                      <img src={featuredProject.logoUrl} alt="" className="h-4 w-4 rounded object-contain" />
                    )}
                    <span>{featuredProject.title}</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Quick Studio Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin/profile"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#070B14] hover:bg-slate-800 border border-slate-700 text-slate-100 text-xs font-semibold transition-colors"
            >
              <EditIcon sx={{ fontSize: 16 }} /> Edit Identity
            </Link>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={handleRevalidate}
              disabled={revalidating}
              startIcon={<RefreshIcon />}
              sx={{ px: 2, py: 1.1 }}
            >
              {revalidating ? "Refreshing..." : "Refresh Live Cache"}
            </Button>
            {totalMissing > 0 && (
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleSyncDefaults}
                disabled={syncing}
                startIcon={<SyncIcon />}
                sx={{ px: 2, py: 1.1 }}
              >
                {syncing ? "Syncing..." : `Sync ${totalMissing} Missing`}
              </Button>
            )}
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors"
            >
              <OpenIcon sx={{ fontSize: 16 }} /> Open Live Site
            </Link>
          </div>
        </div>

        {/* Stat Strip */}
        <div className="mt-6 pt-5 border-t border-slate-800/90 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { label: "Jobs", count: data.counts.jobs, href: "/admin/jobs", color: "text-cyan-300" },
            { label: "Projects", count: data.counts.projects, href: "/admin/projects", color: "text-emerald-300" },
            { label: "Skills", count: data.counts.skills, href: "/admin/skills", color: "text-amber-300" },
            { label: "Books", count: data.counts.books, href: "/admin/books", color: "text-indigo-300" },
            { label: "Education", count: data.counts.education, href: "/admin/education", color: "text-purple-300" },
            { label: "Certs", count: data.counts.certifications, href: "/admin/certifications", color: "text-pink-300" },
            { label: "Photos", count: data.counts.photos, href: "/admin/photos", color: "text-sky-300" },
            { label: "Security", count: `${secPassing}/${secTotal}`, href: "/admin/security", color: "text-emerald-400" },
          ].map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="rounded-2xl bg-[#070B14] border border-slate-800 hover:border-slate-600 p-3 text-center transition-colors"
            >
              <div className={`text-xl font-extrabold tabular-nums ${stat.color}`}>{stat.count}</div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
                {stat.label}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {banner && (
        <Alert
          severity={banner.type}
          onClose={() => setBanner(null)}
          sx={{ borderRadius: 3 }}
        >
          {banner.text}
        </Alert>
      )}

      {/* Dynamic Site Configuration & Section Visibility Studio */}
      <form
        onSubmit={handleSaveSiteSettings}
        className="rounded-3xl bg-[#0D1322] border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <EyeIcon className="text-emerald-400" fontSize="small" />
              Dynamic Site Controls & Section Switchboard
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Customize Hero status pills, company/project spotlight labels, contact topic chips, and show or hide sections on the live site.
            </p>
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={savingSettings}
            startIcon={<SaveIcon />}
            sx={{ px: 3, py: 1.2 }}
          >
            {savingSettings ? "Saving Live..." : "Save Dynamic Site Settings"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Dynamic Hero, Availability & Location Texts */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-2xl bg-[#070B14] border border-slate-800 p-4 space-y-4">
              <Typography variant="subtitle2" fontWeight={700} color="#E2E8F0">
                Hero Role Pill & Availability Status (EN / DE / AR)
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <TextField
                  label="Hero Badge (EN)"
                  size="small"
                  value={settingsForm.heroBadge || ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroBadge: e.target.value })}
                />
                <TextField
                  label="Hero Badge (DE)"
                  size="small"
                  value={settingsForm.heroBadge_de || ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroBadge_de: e.target.value })}
                />
                <TextField
                  label="Hero Badge (AR)"
                  size="small"
                  dir="rtl"
                  value={settingsForm.heroBadge_ar || ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroBadge_ar: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <TextField
                  label="Availability Tag (EN)"
                  size="small"
                  placeholder="Optional green pulse badge"
                  value={settingsForm.availabilityLabel || ""}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, availabilityLabel: e.target.value })
                  }
                />
                <TextField
                  label="Availability Tag (DE)"
                  size="small"
                  value={settingsForm.availabilityLabel_de || ""}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, availabilityLabel_de: e.target.value })
                  }
                />
                <TextField
                  label="Availability Tag (AR)"
                  size="small"
                  dir="rtl"
                  value={settingsForm.availabilityLabel_ar || ""}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, availabilityLabel_ar: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <TextField
                  label="Contact Location (EN)"
                  size="small"
                  value={settingsForm.locationLabel || ""}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, locationLabel: e.target.value })
                  }
                />
                <TextField
                  label="Company Card Label"
                  size="small"
                  value={settingsForm.featuredCompanyLabel || ""}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, featuredCompanyLabel: e.target.value })
                  }
                />
                <TextField
                  label="Project Card Label"
                  size="small"
                  value={settingsForm.featuredProjectLabel || ""}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, featuredProjectLabel: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Dynamic Contact Inquiry Options */}
            <div className="rounded-2xl bg-[#070B14] border border-slate-800 p-4 space-y-4">
              <Typography variant="subtitle2" fontWeight={700} color="#E2E8F0">
                Dynamic Contact Form Topics & Scope Chips
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2.5">
                  <div className="text-xs font-semibold text-slate-400">Inquiry Topics</div>
                  <div className="flex flex-wrap gap-1.5">
                    {(settingsForm.serviceOptions || []).map((opt) => (
                      <Chip
                        key={opt}
                        label={opt}
                        size="small"
                        onDelete={() => removeChip("serviceOptions", opt)}
                        sx={{ bgcolor: "#1E293B", color: "#E2E8F0" }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Add topic (e.g. AWS Architecture)"
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addChip("serviceOptions", newTopic, () => setNewTopic(""));
                        }
                      }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => addChip("serviceOptions", newTopic, () => setNewTopic(""))}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="text-xs font-semibold text-slate-400">Project Scope / Budget</div>
                  <div className="flex flex-wrap gap-1.5">
                    {(settingsForm.budgetOptions || []).map((opt) => (
                      <Chip
                        key={opt}
                        label={opt}
                        size="small"
                        onDelete={() => removeChip("budgetOptions", opt)}
                        sx={{ bgcolor: "#064E3B", color: "#A7F3D0" }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Add scope (e.g. Consulting Retainer)"
                      value={newScope}
                      onChange={(e) => setNewScope(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addChip("budgetOptions", newScope, () => setNewScope(""));
                        }
                      }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      color="secondary"
                      onClick={() => addChip("budgetOptions", newScope, () => setNewScope(""))}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Section Visibility Switchboard */}
          <div className="lg:col-span-5 rounded-2xl bg-[#070B14] border border-slate-800 p-4 space-y-2">
            <Typography variant="subtitle2" fontWeight={700} color="#E2E8F0" mb={1}>
              Live Portfolio Section Visibility
            </Typography>
            <div className="divide-y divide-slate-800/80">
              {SECTION_SWITCHES.map((sw) => {
                const enabled = settingsForm[sw.key] !== false;
                return (
                  <div key={String(sw.key)} className="flex items-center justify-between py-2 gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-100">{sw.label}</div>
                      <div className="text-[11px] text-slate-400">{sw.hint}</div>
                    </div>
                    <Switch
                      color="primary"
                      checked={enabled}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          [sw.key]: e.target.checked,
                        })
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </form>

      {/* Live Portfolio Inventory Mirroring Every Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Experience & Jobs */}
        <section className="rounded-3xl bg-[#0D1322] border border-slate-800 p-6 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                <JobIcon fontSize="small" />
              </span>
              <div>
                <h3 className="text-base font-bold text-white">Work Experience</h3>
                <p className="text-xs text-slate-400">{data.counts.jobs} role(s) stored in MongoDB</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href="/admin/jobs/new"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/25"
              >
                <AddIcon sx={{ fontSize: 14 }} /> New
              </Link>
              <Link
                href="/admin/jobs"
                className="px-2.5 py-1.5 rounded-xl bg-[#070B14] border border-slate-700 text-slate-200 text-xs font-semibold hover:border-slate-500"
              >
                Manage All
              </Link>
            </div>
          </div>

          <div className="space-y-2.5">
            {data.previews.jobs.map((job) => (
              <Link
                key={job._id}
                href={`/admin/jobs/${job._id}`}
                className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#070B14] border border-slate-800 hover:border-cyan-400/50 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white truncate">{job.company}</span>
                    {job.isCurrent && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 truncate">
                    {job.role} · {job.startDate} – {job.endDate || "Present"}
                  </div>
                </div>
                <EditIcon sx={{ fontSize: 16 }} className="text-slate-500 shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Projects & Live Demos */}
        <section className="rounded-3xl bg-[#0D1322] border border-slate-800 p-6 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                <ProjectIcon fontSize="small" />
              </span>
              <div>
                <h3 className="text-base font-bold text-white">Selected Projects</h3>
                <p className="text-xs text-slate-400">{data.counts.projects} project(s) live</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href="/admin/projects/new"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/25"
              >
                <AddIcon sx={{ fontSize: 14 }} /> New
              </Link>
              <Link
                href="/admin/projects"
                className="px-2.5 py-1.5 rounded-xl bg-[#070B14] border border-slate-700 text-slate-200 text-xs font-semibold hover:border-slate-500"
              >
                Manage All
              </Link>
            </div>
          </div>

          <div className="space-y-2.5">
            {data.previews.projects.slice(0, 4).map((proj) => (
              <Link
                key={proj._id}
                href={`/admin/projects/${proj._id}`}
                className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#070B14] border border-slate-800 hover:border-emerald-400/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {proj.logoUrl && (
                    <img
                      src={proj.logoUrl}
                      alt=""
                      className="h-8 w-8 rounded-lg bg-slate-900 p-1 object-contain border border-slate-800 shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white truncate">{proj.title}</span>
                      {proj.featured && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      {proj.subtitle || proj.demoUrl || "Full-stack project"}
                    </div>
                  </div>
                </div>
                <EditIcon sx={{ fontSize: 16 }} className="text-slate-500 shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* Technical & AWS Cloud Stack */}
        <section className="rounded-3xl bg-[#0D1322] border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-300">
                <CloudIcon fontSize="small" />
              </span>
              <div>
                <h3 className="text-base font-bold text-white">Skills & AWS Cloud Stack</h3>
                <p className="text-xs text-slate-400">{data.counts.skills} skills across {Object.keys(data.skillBreakdown).length} categories</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href="/admin/skills/new"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/25"
              >
                <AddIcon sx={{ fontSize: 14 }} /> New
              </Link>
              <Link
                href="/admin/skills"
                className="px-2.5 py-1.5 rounded-xl bg-[#070B14] border border-slate-700 text-slate-200 text-xs font-semibold hover:border-slate-500"
              >
                Manage All
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.entries(data.skillBreakdown).map(([cat, count]) => (
              <span
                key={cat}
                className="px-2.5 py-1 rounded-xl bg-[#070B14] border border-slate-800 text-xs font-semibold text-slate-200"
              >
                {cat}: <span className="text-amber-300">{count}</span>
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {data.previews.skills.map((skill) => (
              <Link
                key={skill._id}
                href={`/admin/skills/${skill._id}`}
                className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-amber-400/50 text-xs text-slate-300 hover:text-white transition-colors"
              >
                {skill.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Published Books & Multi-Library Distribution */}
        <section className="rounded-3xl bg-[#0D1322] border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-300">
                <BookIcon fontSize="small" />
              </span>
              <div>
                <h3 className="text-base font-bold text-white">Published Books & Libraries</h3>
                <p className="text-xs text-slate-400">{data.counts.books} publication(s) with library links</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href="/admin/books/new"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/25"
              >
                <AddIcon sx={{ fontSize: 14 }} /> New
              </Link>
              <Link
                href="/admin/books"
                className="px-2.5 py-1.5 rounded-xl bg-[#070B14] border border-slate-700 text-slate-200 text-xs font-semibold hover:border-slate-500"
              >
                Manage All
              </Link>
            </div>
          </div>

          <div className="space-y-2.5">
            {data.previews.books.slice(0, 4).map((book) => (
              <Link
                key={book._id}
                href={`/admin/books/${book._id}`}
                className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#070B14] border border-slate-800 hover:border-indigo-400/50 transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">{book.title}</div>
                  <div className="text-xs text-slate-400 truncate">
                    {book.libraryCount} digital library link(s)
                    {book.downloadsLabel ? ` · ${book.downloadsLabel}` : ""}
                  </div>
                </div>
                <EditIcon sx={{ fontSize: 16 }} className="text-slate-500 shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* Education & Certifications */}
        <section className="rounded-3xl bg-[#0D1322] border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300">
                <EducationIcon fontSize="small" />
              </span>
              <div>
                <h3 className="text-base font-bold text-white">Education & Certifications</h3>
                <p className="text-xs text-slate-400">
                  {data.counts.education} degree(s) · {data.counts.certifications} cert(s)
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href="/admin/education"
                className="px-2.5 py-1.5 rounded-xl bg-[#070B14] border border-slate-700 text-slate-200 text-xs font-semibold hover:border-slate-500"
              >
                Education
              </Link>
              <Link
                href="/admin/certifications"
                className="px-2.5 py-1.5 rounded-xl bg-[#070B14] border border-slate-700 text-slate-200 text-xs font-semibold hover:border-slate-500"
              >
                Certs
              </Link>
            </div>
          </div>

          <div className="space-y-2">
            {data.previews.education.map((edu) => (
              <Link
                key={edu._id}
                href={`/admin/education/${edu._id}`}
                className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#070B14] border border-slate-800 hover:border-purple-400/50 text-xs transition-colors"
              >
                <span className="font-semibold text-white truncate">
                  {edu.degree} — <span className="text-slate-400">{edu.institution}</span>
                </span>
                <span className="text-purple-300 shrink-0">{edu.year}</span>
              </Link>
            ))}
            {data.previews.certifications.slice(0, 3).map((cert) => (
              <Link
                key={cert._id}
                href={`/admin/certifications/${cert._id}`}
                className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#070B14] border border-slate-800 hover:border-pink-400/50 text-xs transition-colors"
              >
                <span className="flex items-center gap-1.5 text-slate-200 truncate">
                  <CertIcon sx={{ fontSize: 14 }} className="text-pink-400 shrink-0" />
                  {cert.name} · <span className="text-slate-400">{cert.issuer}</span>
                </span>
                <span className="text-slate-400 shrink-0">{cert.date}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Photo Gallery & Contact Identity */}
        <section className="rounded-3xl bg-[#0D1322] border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-sky-950/60 border border-sky-500/30 text-sky-300">
                <PhotoIcon fontSize="small" />
              </span>
              <div>
                <h3 className="text-base font-bold text-white">Gallery & Contact Channels</h3>
                <p className="text-xs text-slate-400">
                  {data.counts.photos} gallery photo(s) · {data.profile.email || "No email"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href="/admin/photos"
                className="px-2.5 py-1.5 rounded-xl bg-[#070B14] border border-slate-700 text-slate-200 text-xs font-semibold hover:border-slate-500"
              >
                Gallery
              </Link>
              <Link
                href="/admin/profile"
                className="px-2.5 py-1.5 rounded-xl bg-[#070B14] border border-slate-700 text-slate-200 text-xs font-semibold hover:border-slate-500"
              >
                Profile
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {data.previews.photos.slice(0, 4).map((photo) => (
              <Link
                key={photo._id}
                href="/admin/photos"
                className="aspect-square rounded-xl overflow-hidden bg-[#070B14] border border-slate-800 hover:border-sky-400/50 transition-colors"
              >
                <img
                  src={photo.url}
                  alt={photo.title || "Gallery preview"}
                  className="w-full h-full object-cover"
                />
              </Link>
            ))}
          </div>

          <div className="p-3 rounded-2xl bg-[#070B14] border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="flex items-center gap-2 text-slate-300">
              <PersonIcon sx={{ fontSize: 15 }} className="text-emerald-400" />
              {settingsForm.locationLabel || "Germany"} · {(data.profile.languages || []).length} language(s)
            </span>
            <Link href="/admin/security" className="text-emerald-300 font-semibold hover:underline flex items-center gap-1">
              <ShieldIcon sx={{ fontSize: 14 }} /> {secPassing}/{secTotal} Security Checks
            </Link>
          </div>
        </section>
      </div>

      {/* Security Diagnostics Compact Audit Row */}
      <section className="rounded-3xl bg-[#0D1322] border border-slate-800 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <ShieldIcon className="text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white">Runtime Security Audit</h3>
              <p className="text-xs text-slate-400">
                Signed in as <strong className="text-slate-200">{data.security.adminEmail}</strong> · Setup route{" "}
                {data.security.setupLocked ? "locked" : "open"}
              </p>
            </div>
          </div>
          <Link
            href="/admin/security"
            className="px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-xs font-bold hover:bg-emerald-500/25"
          >
            Rotate Password & Revoke Sessions →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {securityItems.map((diag) => (
            <div
              key={diag.label}
              className="p-3.5 rounded-2xl bg-[#070B14] border border-slate-800 flex items-start gap-2.5"
            >
              <CheckIcon
                sx={{ fontSize: 18, mt: 0.2 }}
                className={diag.ok ? "text-emerald-400" : "text-amber-400"}
              />
              <div>
                <div className="text-xs font-bold text-white">{diag.label}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{diag.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
