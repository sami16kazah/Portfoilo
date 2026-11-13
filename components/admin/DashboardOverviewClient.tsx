"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import {
  FaBook,
  FaBriefcase,
  FaCertificate,
  FaCheckCircle,
  FaCode,
  FaEdit,
  FaExclamationTriangle,
  FaExternalLinkAlt,
  FaGraduationCap,
  FaImages,
  FaPlus,
  FaProjectDiagram,
  FaShieldAlt,
  FaSyncAlt,
  FaUser,
} from "react-icons/fa";

interface OverviewData {
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
  missingDefaults: {
    profile: number;
    jobs: number;
    projects: number;
    skills: number;
    books: number;
    education: number;
    certifications: number;
    photos: number;
  };
  security: {
    adminEmail: string;
    setupLocked: boolean;
    diagnostics: {
      hasAuthSecret: boolean;
      cloudinarySecretNonPublic: boolean;
      cloudinarySecretLegacyPublic: boolean;
      hasDatabaseUri: boolean;
      hasSetupToken: boolean;
      hasMailjet: boolean;
      isProduction: boolean;
    };
  };
}

const SECTION_CARDS = [
  {
    key: "profile" as const,
    title: "Profile, Hero & Socials",
    desc: "Name, role, EN/DE/AR bio, avatar, CV, languages & social links.",
    manageHref: "/admin/profile",
    manageLabel: "Edit Profile",
    addHref: null,
    Icon: FaUser,
  },
  {
    key: "jobs" as const,
    title: "Jobs & Experience",
    desc: "Work history, cloudvibe GmbH details, highlights & performance metrics.",
    manageHref: "/admin/jobs",
    manageLabel: "Manage Jobs",
    addHref: "/admin/jobs/new",
    Icon: FaBriefcase,
  },
  {
    key: "projects" as const,
    title: "Projects & Shelforia Demo",
    desc: "Projects, team credits, video demo MP4/chapters, highlights & tags.",
    manageHref: "/admin/projects",
    manageLabel: "Manage Projects",
    addHref: "/admin/projects/new",
    Icon: FaProjectDiagram,
  },
  {
    key: "skills" as const,
    title: "Skills & AWS Cloud",
    desc: "Technical stack, AWS Cloud services, categories & proficiency.",
    manageHref: "/admin/skills",
    manageLabel: "Manage Skills",
    addHref: "/admin/skills/new",
    Icon: FaCode,
  },
  {
    key: "books" as const,
    title: "Published Books",
    desc: "Multilingual book descriptions, covers, topics & multi-library links.",
    manageHref: "/admin/books",
    manageLabel: "Manage Books",
    addHref: "/admin/books/new",
    Icon: FaBook,
  },
  {
    key: "education" as const,
    title: "Education",
    desc: "University degree, dates & multilingual coursework descriptions.",
    manageHref: "/admin/education",
    manageLabel: "Manage Education",
    addHref: "/admin/education/new",
    Icon: FaGraduationCap,
  },
  {
    key: "certifications" as const,
    title: "Certifications",
    desc: "Professional certificates, issuers, dates & verification links.",
    manageHref: "/admin/certifications",
    manageLabel: "Manage Certs",
    addHref: "/admin/certifications/new",
    Icon: FaCertificate,
  },
  {
    key: "photos" as const,
    title: "Photo Gallery",
    desc: "Gallery photos via Cloudinary upload or direct URL with titles.",
    manageHref: "/admin/photos",
    manageLabel: "Manage Photos",
    addHref: null,
    Icon: FaImages,
  },
];

export default function DashboardOverviewClient() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [revalidating, setRevalidating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const loadOverview = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/overview", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load overview");
      const json = (await res.json()) as OverviewData;
      setData(json);
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", text: "Unable to load portfolio database overview." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const handleSyncDefaults = async () => {
    setSyncing(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/migrate", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Sync failed");
      setFeedback({ type: "success", text: json.message || "Defaults synced to MongoDB." });
      await loadOverview();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to sync portfolio defaults.",
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleRevalidate = async () => {
    setRevalidating(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/overview", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Revalidation failed");
      setFeedback({ type: "success", text: json.message });
    } catch (err) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to revalidate site cache.",
      });
    } finally {
      setRevalidating(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress />
      </Box>
    );
  }

  const totalMissing = data
    ? Object.values(data.missingDefaults).reduce((acc, n) => acc + n, 0)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header + Global Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Portfolio Control Center
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Edit any section of your live multilingual portfolio (EN / DE / AR), sync built-in records to MongoDB, and audit security.
          </Typography>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Button
            variant="outlined"
            startIcon={<FaSyncAlt className={revalidating ? "animate-spin" : ""} />}
            onClick={handleRevalidate}
            disabled={revalidating}
          >
            {revalidating ? "Refreshing..." : "Refresh Live Cache"}
          </Button>
          <Button
            variant="contained"
            startIcon={<FaSyncAlt className={syncing ? "animate-spin" : ""} />}
            onClick={handleSyncDefaults}
            disabled={syncing}
            sx={{ bgcolor: "#059669", "&:hover": { bgcolor: "#047857" } }}
          >
            {syncing
              ? "Syncing to DB..."
              : totalMissing > 0
              ? `Sync ${totalMissing} Default Item(s) to DB`
              : "Sync Defaults Check"}
          </Button>
        </div>
      </div>

      {feedback && <Alert severity={feedback.type}>{feedback.text}</Alert>}

      {/* Sync guidance when items still live only in static defaults */}
      {totalMissing > 0 && (
        <Alert
          severity="info"
          action={
            <Button color="inherit" size="small" onClick={handleSyncDefaults} disabled={syncing}>
              Sync Now
            </Button>
          }
        >
          Some portfolio content (e.g. <strong>cloudvibe GmbH</strong>, <strong>shelforia</strong>, or <strong>AWS Cloud</strong> skills) is currently served from static code defaults and not yet stored in MongoDB. Click <strong>Sync Now</strong> to copy missing items into MongoDB so you can edit or delete them here.
        </Alert>
      )}

      {/* Portfolio Editable Sections Grid */}
      <Grid container spacing={3}>
        {SECTION_CARDS.map((card) => {
          const Icon = card.Icon;
          const dbCount = data?.counts[card.key] ?? 0;
          const missing = data?.missingDefaults[card.key] ?? 0;

          return (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={card.key}>
              <Card className="h-full border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="h-full flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <Icon />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Chip
                          size="small"
                          label={card.key === "profile" ? (dbCount > 0 ? "Saved" : "Default") : `${dbCount} in DB`}
                          color={dbCount > 0 && missing === 0 ? "success" : "default"}
                          variant="outlined"
                        />
                        {missing > 0 && (
                          <Chip size="small" label={`+${missing} unsynced`} color="warning" />
                        )}
                      </div>
                    </div>

                    <div>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {card.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" className="mt-1">
                        {card.desc}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      component={Link}
                      href={card.manageHref}
                      variant="contained"
                      size="small"
                      startIcon={<FaEdit />}
                      fullWidth
                      sx={{ bgcolor: "#0f172a", "&:hover": { bgcolor: "#1e293b" } }}
                    >
                      {card.manageLabel}
                    </Button>
                    {card.addHref && (
                      <Button
                        component={Link}
                        href={card.addHref}
                        variant="outlined"
                        size="small"
                        aria-label={`Add new ${card.title}`}
                        sx={{ minWidth: "38px", px: 1 }}
                      >
                        <FaPlus />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Bottom Row: Security Posture + Quick Public Links */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card className="border border-slate-200 h-full">
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <FaShieldAlt className="text-emerald-600 text-xl" />
                  <Typography variant="h6" fontWeight="bold">
                    Security & Account Posture
                  </Typography>
                </div>
                <Button
                  component={Link}
                  href="/admin/security"
                  variant="outlined"
                  size="small"
                >
                  Security Settings
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <StatusItem
                  ok={Boolean(data?.security.setupLocked)}
                  label={
                    data?.security.setupLocked
                      ? "Public /setup page is locked"
                      : "Setup unlocked — create admin or check DB"
                  }
                />
                <StatusItem
                  ok={Boolean(data?.security.diagnostics.hasAuthSecret)}
                  label={
                    data?.security.diagnostics.hasAuthSecret
                      ? "AUTH_SECRET configured"
                      : "Missing AUTH_SECRET env var"
                  }
                />
                <StatusItem
                  ok={!data?.security.diagnostics.cloudinarySecretLegacyPublic || Boolean(data?.security.diagnostics.cloudinarySecretNonPublic)}
                  label={
                    data?.security.diagnostics.cloudinarySecretNonPublic
                      ? "Cloudinary secret is server-only"
                      : data?.security.diagnostics.cloudinarySecretLegacyPublic
                      ? "Rename NEXT_PUBLIC_CLOUDINARY_API_SECRET -> CLOUDINARY_API_SECRET"
                      : "Cloudinary secret not configured"
                  }
                />
                <StatusItem
                  ok
                  label="Login rate limit, NoSQL & XSS guards, Session revocation active"
                />
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Card className="border border-slate-200 h-full">
            <CardContent className="space-y-4">
              <Typography variant="h6" fontWeight="bold">
                Live Portfolio & SEO Endpoints
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Inspect your published site across all three languages and crawler manifests after saving edits.
              </Typography>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "English (/en)", href: "/en" },
                  { label: "Deutsch (/de)", href: "/de" },
                  { label: "العربية (/ar)", href: "/ar" },
                  { label: "Sitemap", href: "/sitemap.xml" },
                  { label: "llms.txt", href: "/llms.txt" },
                  { label: "llms-full.txt", href: "/llms-full.txt" },
                ].map((link) => (
                  <Button
                    key={link.href}
                    component="a"
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    variant="outlined"
                    endIcon={<FaExternalLinkAlt className="text-[10px]" />}
                  >
                    {link.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

function StatusItem({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div
      className={`flex items-start gap-2.5 p-3 rounded-lg border ${
        ok
          ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
          : "bg-amber-50 border-amber-200 text-amber-900"
      }`}
    >
      {ok ? (
        <FaCheckCircle className="text-emerald-600 mt-0.5 shrink-0" />
      ) : (
        <FaExclamationTriangle className="text-amber-600 mt-0.5 shrink-0" />
      )}
      <span className="text-xs font-medium leading-snug">{label}</span>
    </div>
  );
}
