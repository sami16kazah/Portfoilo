"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { FaArrowLeft, FaPlus, FaSave, FaTrash } from "react-icons/fa";
import CloudinaryUploadButton from "@/components/admin/CloudinaryUploadButton";

interface VideoChapterForm {
  title: string;
  title_de: string;
  title_ar: string;
  url: string;
}

export default function ProjectForm({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const isNew = resolvedParams.id === "new";

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [videoChapters, setVideoChapters] = useState<VideoChapterForm[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    title_de: "",
    title_ar: "",
    subtitle: "",
    subtitle_de: "",
    subtitle_ar: "",
    description: "",
    description_de: "",
    description_ar: "",
    credits: "",
    credits_de: "",
    credits_ar: "",
    highlights: "",
    highlights_de: "",
    highlights_ar: "",
    tags: "",
    repoUrl: "",
    demoUrl: "",
    videoUrl: "",
    imageUrl: "",
    logoUrl: "",
    brandColor: "#059669",
    demoStatus: "ready",
    date: "",
    featured: false,
  });

  useEffect(() => {
    if (!isNew) {
      fetchProject(resolvedParams.id);
    }
  }, [isNew, resolvedParams.id]);

  const fetchProject = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load project");
      const data = await res.json();
      setFormData({
        title: data.title || "",
        title_de: data.title_de || "",
        title_ar: data.title_ar || "",
        subtitle: data.subtitle || "",
        subtitle_de: data.subtitle_de || "",
        subtitle_ar: data.subtitle_ar || "",
        description: Array.isArray(data.description) ? data.description.join("\n") : data.description || "",
        description_de: Array.isArray(data.description_de) ? data.description_de.join("\n") : data.description_de || "",
        description_ar: Array.isArray(data.description_ar) ? data.description_ar.join("\n") : data.description_ar || "",
        credits: data.credits || "",
        credits_de: data.credits_de || "",
        credits_ar: data.credits_ar || "",
        highlights: Array.isArray(data.highlights) ? data.highlights.join("\n") : "",
        highlights_de: Array.isArray(data.highlights_de) ? data.highlights_de.join("\n") : "",
        highlights_ar: Array.isArray(data.highlights_ar) ? data.highlights_ar.join("\n") : "",
        tags: Array.isArray(data.tags) ? data.tags.join(", ") : data.tags || "",
        repoUrl: data.repoUrl || "",
        demoUrl: data.demoUrl || "",
        videoUrl: data.videoUrl || "",
        imageUrl: data.imageUrl || "",
        logoUrl: data.logoUrl || "",
        brandColor: data.brandColor || "#059669",
        demoStatus: data.demoStatus || "ready",
        date: data.date || "",
        featured: Boolean(data.featured),
      });
      setVideoChapters(
        Array.isArray(data.videoChapters)
          ? data.videoChapters.map((ch: VideoChapterForm) => ({
              title: ch.title || "",
              title_de: ch.title_de || "",
              title_ar: ch.title_ar || "",
              url: ch.url || "",
            }))
          : []
      );
    } catch (error) {
      console.error("Failed to fetch project", error);
      setErrorMsg("Unable to fetch project details.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addChapter = () => {
    setVideoChapters((prev) => [...prev, { title: "", title_de: "", title_ar: "", url: "" }]);
  };

  const removeChapter = (index: number) => {
    setVideoChapters((prev) => prev.filter((_, i) => i !== index));
  };

  const updateChapter = (index: number, field: keyof VideoChapterForm, value: string) => {
    setVideoChapters((prev) =>
      prev.map((ch, i) => (i === index ? { ...ch, [field]: value } : ch))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const splitLines = (raw: string) =>
      raw
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    const payload = {
      ...formData,
      description: splitLines(formData.description),
      description_de: splitLines(formData.description_de),
      description_ar: splitLines(formData.description_ar),
      highlights: splitLines(formData.highlights),
      highlights_de: splitLines(formData.highlights_de),
      highlights_ar: splitLines(formData.highlights_ar),
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      videoChapters: videoChapters
        .map((ch) => ({
          title: ch.title.trim(),
          title_de: ch.title_de.trim(),
          title_ar: ch.title_ar.trim(),
          url: ch.url.trim(),
        }))
        .filter((ch) => ch.title && ch.url),
    };

    try {
      const url = isNew ? "/api/projects" : `/api/projects/${resolvedParams.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/projects");
        router.refresh();
        return;
      }
      const data = await res.json();
      setErrorMsg(data.error || "Failed to save project.");
    } catch (error) {
      console.error("Failed to save project", error);
      setErrorMsg("Network error while saving project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button startIcon={<FaArrowLeft />} onClick={() => router.back()} color="inherit">
          Back
        </Button>
        <Typography variant="h4" component="h1" fontWeight="bold">
          {isNew ? "Add New Project" : "Edit Project"}
        </Typography>
      </div>

      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <Paper className="p-8 radius-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <TextField
            label="Project Title (English)"
            name="title"
            fullWidth
            required
            value={formData.title}
            onChange={handleChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField label="Project Title (German)" name="title_de" fullWidth value={formData.title_de} onChange={handleChange} />
            <TextField label="Project Title (Arabic)" name="title_ar" fullWidth dir="rtl" value={formData.title_ar} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TextField label="Subtitle / Tagline (EN)" name="subtitle" fullWidth value={formData.subtitle} onChange={handleChange} />
            <TextField label="Subtitle (DE)" name="subtitle_de" fullWidth value={formData.subtitle_de} onChange={handleChange} />
            <TextField label="Subtitle (AR)" name="subtitle_ar" fullWidth dir="rtl" value={formData.subtitle_ar} onChange={handleChange} />
          </div>

          <TextField
            label="Description (English) - one paragraph per line"
            name="description"
            fullWidth
            multiline
            rows={4}
            required
            value={formData.description}
            onChange={handleChange}
            helperText="Separate paragraphs with a new line"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField label="Description (German)" name="description_de" fullWidth multiline rows={4} value={formData.description_de} onChange={handleChange} />
            <TextField label="Description (Arabic)" name="description_ar" fullWidth multiline rows={4} dir="rtl" value={formData.description_ar} onChange={handleChange} />
          </div>

          <Divider />
          <Typography variant="h6">Highlights & Team Credits</Typography>

          <TextField
            label="Key Highlights (EN - one bullet per line)"
            name="highlights"
            fullWidth
            multiline
            rows={3}
            value={formData.highlights}
            onChange={handleChange}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField label="Highlights (DE)" name="highlights_de" fullWidth multiline rows={3} value={formData.highlights_de} onChange={handleChange} />
            <TextField label="Highlights (AR)" name="highlights_ar" fullWidth multiline rows={3} dir="rtl" value={formData.highlights_ar} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TextField label="Credits / Team (EN)" name="credits" fullWidth value={formData.credits} onChange={handleChange} />
            <TextField label="Credits / Team (DE)" name="credits_de" fullWidth value={formData.credits_de} onChange={handleChange} />
            <TextField label="Credits / Team (AR)" name="credits_ar" fullWidth dir="rtl" value={formData.credits_ar} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField label="Date (e.g., 2025 - Present)" name="date" fullWidth value={formData.date} onChange={handleChange} />
            <TextField label="Tags (comma separated)" name="tags" fullWidth value={formData.tags} onChange={handleChange} helperText="e.g., Next.js, TypeScript, AWS" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField label="Repository URL" name="repoUrl" fullWidth value={formData.repoUrl} onChange={handleChange} />
            <TextField label="Live Site / Demo URL" name="demoUrl" fullWidth value={formData.demoUrl} onChange={handleChange} />
          </div>

          <Divider />
          <Typography variant="h6">Media, Demo Video & Branding</Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormControl fullWidth>
              <InputLabel>Demo Status</InputLabel>
              <Select
                value={formData.demoStatus}
                label="Demo Status"
                onChange={(e) => setFormData((prev) => ({ ...prev, demoStatus: e.target.value }))}
              >
                <MenuItem value="ready">Ready (Live Video / Interactive Demo)</MenuItem>
                <MenuItem value="coming_soon">Coming Soon (Demo Upload Pending)</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Brand Accent Color (Hex)"
              name="brandColor"
              fullWidth
              value={formData.brandColor}
              onChange={handleChange}
              placeholder="#24423A"
            />
          </div>

          <div className="flex gap-4 items-end">
            <TextField
              fullWidth
              label="Preview Image URL"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
            <CloudinaryUploadButton
              signatureEndpoint="/api/sign-cloudinary-params"
              onSuccess={(result: unknown) => {
                const url = (result as { info?: { secure_url?: string } })?.info?.secure_url;
                if (url) setFormData((prev) => ({ ...prev, imageUrl: url }));
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-colors"
            >
              Upload Image
            </CloudinaryUploadButton>
          </div>

          <div className="flex gap-4 items-end">
            <TextField
              fullWidth
              label="Project Logo URL"
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
            />
            <CloudinaryUploadButton
              signatureEndpoint="/api/sign-cloudinary-params"
              onSuccess={(result: unknown) => {
                const url = (result as { info?: { secure_url?: string } })?.info?.secure_url;
                if (url) setFormData((prev) => ({ ...prev, logoUrl: url }));
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-colors"
            >
              Upload Logo
            </CloudinaryUploadButton>
          </div>

          <div className="flex gap-4 items-end">
            <TextField
              fullWidth
              label="Main Demo Video URL (MP4)"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              helperText="Upload your project demo video to Cloudinary or paste a direct MP4 URL"
            />
            <CloudinaryUploadButton
              signatureEndpoint="/api/sign-cloudinary-params"
              onSuccess={(result: unknown) => {
                const url = (result as { info?: { secure_url?: string } })?.info?.secure_url;
                if (url) setFormData((prev) => ({ ...prev, videoUrl: url, demoStatus: "ready" }));
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-colors"
            >
              Upload Video
            </CloudinaryUploadButton>
          </div>

          {/* Demo Video Chapters */}
          <Box className="rounded-xl border border-slate-800 bg-[#070B14] p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <Typography variant="subtitle1" fontWeight="bold">
                  Video Walkthrough Chapters (Optional)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Add multiple walkthrough clips (e.g. Admin Panel, Ticket Checkout, Catalog Sync).
                </Typography>
              </div>
              <Button type="button" size="small" variant="outlined" startIcon={<FaPlus />} onClick={addChapter}>
                Add Chapter
              </Button>
            </div>

            {videoChapters.map((ch, idx) => (
              <div key={idx} className="p-3 bg-[#0D1322] rounded-xl border border-slate-800 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <TextField
                    size="small"
                    label="Chapter Title (EN)"
                    value={ch.title}
                    onChange={(e) => updateChapter(idx, "title", e.target.value)}
                  />
                  <TextField
                    size="small"
                    label="Title (DE)"
                    value={ch.title_de}
                    onChange={(e) => updateChapter(idx, "title_de", e.target.value)}
                  />
                  <TextField
                    size="small"
                    label="Title (AR)"
                    dir="rtl"
                    value={ch.title_ar}
                    onChange={(e) => updateChapter(idx, "title_ar", e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <TextField
                    size="small"
                    label="Video URL"
                    className="flex-1 min-w-[220px]"
                    value={ch.url}
                    onChange={(e) => updateChapter(idx, "url", e.target.value)}
                  />
                  <CloudinaryUploadButton
                    signatureEndpoint="/api/sign-cloudinary-params"
                    onSuccess={(result: unknown) => {
                      const url = (result as { info?: { secure_url?: string } })?.info?.secure_url;
                      if (url) updateChapter(idx, "url", url);
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                  >
                    Upload Clip
                  </CloudinaryUploadButton>
                  <Button
                    type="button"
                    color="error"
                    size="small"
                    onClick={() => removeChapter(idx)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </div>
            ))}
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={formData.featured}
                onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                color="primary"
              />
            }
            label="Featured Project (Show on Home)"
          />

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<FaSave />}
              disabled={loading}
              color="primary"
            >
              {loading ? "Saving..." : "Save Project"}
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
}
