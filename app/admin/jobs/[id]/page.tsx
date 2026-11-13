"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Divider,
  FormControlLabel,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { FaArrowLeft, FaPlus, FaSave, FaTrash } from "react-icons/fa";
import CloudinaryUploadButton from "@/components/admin/CloudinaryUploadButton";

interface JobMetricForm {
  label: string;
  label_de: string;
  label_ar: string;
  value: string;
  detail: string;
  detail_de: string;
  detail_ar: string;
}

export default function JobForm({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const isNew = resolvedParams.id === "new";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [performanceMetrics, setPerformanceMetrics] = useState<JobMetricForm[]>([]);

  const [formData, setFormData] = useState({
    company: "",
    companyUrl: "",
    logoUrl: "",
    role: "",
    role_de: "",
    role_ar: "",
    location: "",
    location_de: "",
    location_ar: "",
    employmentType: "Full-time",
    startDate: "",
    endDate: "",
    isCurrent: true,
    summary: "",
    summary_de: "",
    summary_ar: "",
    highlights: "",
    highlights_de: "",
    highlights_ar: "",
    techStack: "",
    featured: true,
    order: 0,
  });

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/jobs/${resolvedParams.id}`, { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            company: data.company || "",
            companyUrl: data.companyUrl || "",
            logoUrl: data.logoUrl || "",
            role: data.role || "",
            role_de: data.role_de || "",
            role_ar: data.role_ar || "",
            location: data.location || "",
            location_de: data.location_de || "",
            location_ar: data.location_ar || "",
            employmentType: data.employmentType || "Full-time",
            startDate: data.startDate || "",
            endDate: data.endDate || "",
            isCurrent: Boolean(data.isCurrent),
            summary: data.summary || "",
            summary_de: data.summary_de || "",
            summary_ar: data.summary_ar || "",
            highlights: Array.isArray(data.highlights) ? data.highlights.join("\n") : "",
            highlights_de: Array.isArray(data.highlights_de) ? data.highlights_de.join("\n") : "",
            highlights_ar: Array.isArray(data.highlights_ar) ? data.highlights_ar.join("\n") : "",
            techStack: Array.isArray(data.techStack) ? data.techStack.join(", ") : "",
            featured: data.featured ?? true,
            order: data.order ?? 0,
          });
          setPerformanceMetrics(
            Array.isArray(data.performanceMetrics)
              ? data.performanceMetrics.map((m: JobMetricForm) => ({
                  label: m.label || "",
                  label_de: m.label_de || "",
                  label_ar: m.label_ar || "",
                  value: m.value || "",
                  detail: m.detail || "",
                  detail_de: m.detail_de || "",
                  detail_ar: m.detail_ar || "",
                }))
              : []
          );
        })
        .catch((err) => {
          console.error("Failed to fetch job", err);
          setErrorMsg("Unable to fetch job entry.");
        });
    }
  }, [isNew, resolvedParams.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addMetric = () => {
    setPerformanceMetrics((prev) => [
      ...prev,
      { label: "", label_de: "", label_ar: "", value: "", detail: "", detail_de: "", detail_ar: "" },
    ]);
  };

  const removeMetric = (idx: number) => {
    setPerformanceMetrics((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateMetric = (idx: number, field: keyof JobMetricForm, value: string) => {
    setPerformanceMetrics((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const payload = {
      ...formData,
      highlights: formData.highlights.split("\n").map((s) => s.trim()).filter(Boolean),
      highlights_de: formData.highlights_de.split("\n").map((s) => s.trim()).filter(Boolean),
      highlights_ar: formData.highlights_ar.split("\n").map((s) => s.trim()).filter(Boolean),
      techStack: formData.techStack.split(",").map((s) => s.trim()).filter(Boolean),
      performanceMetrics: performanceMetrics
        .map((m) => ({
          label: m.label.trim(),
          label_de: m.label_de.trim(),
          label_ar: m.label_ar.trim(),
          value: m.value.trim(),
          detail: m.detail.trim(),
          detail_de: m.detail_de.trim(),
          detail_ar: m.detail_ar.trim(),
        }))
        .filter((m) => m.label && m.value),
    };

    try {
      const url = isNew ? "/api/jobs" : `/api/jobs/${resolvedParams.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        router.push("/admin/jobs");
        router.refresh();
        return;
      }
      const data = await res.json();
      setErrorMsg(data.error || "Failed to save job.");
    } catch (error) {
      console.error("Failed to save job", error);
      setErrorMsg("Network error while saving job.");
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
          {isNew ? "Add Job" : "Edit Job"}
        </Typography>
      </div>

      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <Paper className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField label="Company Name" name="company" fullWidth required value={formData.company} onChange={handleChange} />
            <TextField label="Company Website" name="companyUrl" fullWidth value={formData.companyUrl} onChange={handleChange} />
          </div>

          <div className="flex gap-4 items-end">
            <TextField label="Company Logo URL" name="logoUrl" fullWidth value={formData.logoUrl} onChange={handleChange} />
            <CloudinaryUploadButton
              signatureEndpoint="/api/sign-cloudinary-params"
              onSuccess={(result: unknown) => {
                const url = (result as { info?: { secure_url?: string } })?.info?.secure_url;
                if (url) setFormData((prev) => ({ ...prev, logoUrl: url }));
              }}
              className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-3 rounded font-medium whitespace-nowrap"
            >
              Upload Logo
            </CloudinaryUploadButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TextField label="Role (EN)" name="role" fullWidth required value={formData.role} onChange={handleChange} />
            <TextField label="Role (DE)" name="role_de" fullWidth value={formData.role_de} onChange={handleChange} />
            <TextField label="Role (AR)" name="role_ar" fullWidth dir="rtl" value={formData.role_ar} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TextField label="Location (EN)" name="location" fullWidth value={formData.location} onChange={handleChange} />
            <TextField label="Location (DE)" name="location_de" fullWidth value={formData.location_de} onChange={handleChange} />
            <TextField label="Location (AR)" name="location_ar" fullWidth dir="rtl" value={formData.location_ar} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TextField label="Start Date (e.g., 2025)" name="startDate" fullWidth value={formData.startDate} onChange={handleChange} />
            <TextField label="End Date" name="endDate" fullWidth disabled={formData.isCurrent} value={formData.endDate} onChange={handleChange} />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isCurrent}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isCurrent: e.target.checked }))}
                />
              }
              label="Current Position"
            />
          </div>

          <TextField label="Summary (EN)" name="summary" fullWidth multiline rows={3} value={formData.summary} onChange={handleChange} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField label="Summary (DE)" name="summary_de" fullWidth multiline rows={3} value={formData.summary_de} onChange={handleChange} />
            <TextField label="Summary (AR)" name="summary_ar" fullWidth multiline rows={3} dir="rtl" value={formData.summary_ar} onChange={handleChange} />
          </div>

          <TextField label="Highlights (EN, one per line)" name="highlights" fullWidth multiline rows={4} value={formData.highlights} onChange={handleChange} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField label="Highlights (DE)" name="highlights_de" fullWidth multiline rows={4} value={formData.highlights_de} onChange={handleChange} />
            <TextField label="Highlights (AR)" name="highlights_ar" fullWidth multiline rows={4} dir="rtl" value={formData.highlights_ar} onChange={handleChange} />
          </div>

          <TextField label="Tech Stack (comma separated)" name="techStack" fullWidth value={formData.techStack} onChange={handleChange} />

          <Divider />

          <Box className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <Typography variant="subtitle1" fontWeight="bold">
                  Role Performance & Architecture Metrics
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  KPI badges displayed directly on the job card (e.g., AWS Frankfurt, GoBD + EN 16931).
                </Typography>
              </div>
              <Button type="button" size="small" variant="outlined" startIcon={<FaPlus />} onClick={addMetric}>
                Add Metric
              </Button>
            </div>

            {performanceMetrics.map((metric, idx) => (
              <div key={idx} className="p-3 bg-white rounded border border-gray-200 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <TextField
                    size="small"
                    label="Value (e.g., AWS Frankfurt)"
                    value={metric.value}
                    onChange={(e) => updateMetric(idx, "value", e.target.value)}
                  />
                  <TextField
                    size="small"
                    label="Label (EN)"
                    value={metric.label}
                    onChange={(e) => updateMetric(idx, "label", e.target.value)}
                  />
                  <TextField
                    size="small"
                    label="Label (DE)"
                    value={metric.label_de}
                    onChange={(e) => updateMetric(idx, "label_de", e.target.value)}
                  />
                  <TextField
                    size="small"
                    label="Label (AR)"
                    dir="rtl"
                    value={metric.label_ar}
                    onChange={(e) => updateMetric(idx, "label_ar", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                  <div className="md:col-span-4">
                    <TextField
                      fullWidth
                      size="small"
                      label="Detail (EN)"
                      value={metric.detail}
                      onChange={(e) => updateMetric(idx, "detail", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-4">
                    <TextField
                      fullWidth
                      size="small"
                      label="Detail (DE)"
                      value={metric.detail_de}
                      onChange={(e) => updateMetric(idx, "detail_de", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <TextField
                      fullWidth
                      size="small"
                      label="Detail (AR)"
                      dir="rtl"
                      value={metric.detail_ar}
                      onChange={(e) => updateMetric(idx, "detail_ar", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-1 flex justify-end">
                    <Button type="button" color="error" size="small" onClick={() => removeMetric(idx)}>
                      <FaTrash />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </Box>

          <div className="flex justify-end pt-4">
            <Button type="submit" variant="contained" size="large" startIcon={<FaSave />} disabled={loading} sx={{ bgcolor: "black", "&:hover": { bgcolor: "#333" } }}>
              {loading ? "Saving..." : "Save Job"}
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
}
