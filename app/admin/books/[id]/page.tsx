"use client";

import { useState, use, useEffect } from "react";
import { Box, Typography, Button, TextField, Paper, Chip, Divider } from "@mui/material";
import { useRouter } from "next/navigation";
import CloudinaryUploadButton from "@/components/admin/CloudinaryUploadButton";
import { FaImage, FaPlus, FaTrash } from "react-icons/fa";
import { type BookLibraryLink, inferLibraryName } from "@/components/portfolio/types";

const LIBRARY_PRESETS = ["Kotobati", "Noor Book", "Google Books", "Foulabook", "GitHub"];

export default function BookForm({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const isNew = id === "new";

  const [formData, setFormData] = useState({
    title: "",
    title_de: "",
    title_ar: "",
    subtitle: "",
    subtitle_de: "",
    subtitle_ar: "",
    coverUrl: "",
    downloadsLabel: "",
    description: "",
    description_de: "",
    description_ar: "",
  });

  const [topicsInput, setTopicsInput] = useState("");
  const [libraryLinks, setLibraryLinks] = useState<BookLibraryLink[]>([{ name: "", url: "" }]);

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/books/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            title: data.title || "",
            title_de: data.title_de || "",
            title_ar: data.title_ar || "",
            subtitle: data.subtitle || "",
            subtitle_de: data.subtitle_de || "",
            subtitle_ar: data.subtitle_ar || "",
            coverUrl: data.coverUrl || "",
            downloadsLabel: data.downloadsLabel || "",
            description: data.description || "",
            description_de: data.description_de || "",
            description_ar: data.description_ar || "",
          });

          setTopicsInput(Array.isArray(data.topics) ? data.topics.join(", ") : "");

          if (Array.isArray(data.libraryLinks) && data.libraryLinks.length > 0) {
            setLibraryLinks(
              data.libraryLinks.map((entry: BookLibraryLink) => ({
                name: entry?.name || "",
                url: entry?.url || "",
              }))
            );
          } else if (data.link) {
            setLibraryLinks([{ name: inferLibraryName(data.link), url: data.link }]);
          } else {
            setLibraryLinks([{ name: "", url: "" }]);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [id, isNew]);

  const handleLibraryChange = (index: number, field: keyof BookLibraryLink, value: string) => {
    setLibraryLinks((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;
        const next = { ...item, [field]: value };
        if (field === "url" && !item.name.trim() && value.trim().startsWith("http")) {
          next.name = inferLibraryName(value);
        }
        return next;
      })
    );
  };

  const handleAddLibraryRow = (presetName = "") => {
    setLibraryLinks((prev) => {
      if (
        presetName &&
        prev.length > 0 &&
        !prev[prev.length - 1].name.trim() &&
        !prev[prev.length - 1].url.trim()
      ) {
        return prev.map((item, idx) =>
          idx === prev.length - 1 ? { ...item, name: presetName } : item
        );
      }
      return [...prev, { name: presetName, url: "" }];
    });
  };

  const handleRemoveLibraryRow = (index: number) => {
    setLibraryLinks((prev) => {
      const next = prev.filter((_, idx) => idx !== index);
      return next.length > 0 ? next : [{ name: "", url: "" }];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isNew ? "POST" : "PUT";
    const url = isNew ? "/api/books" : `/api/books/${id}`;

    const cleanedLinks = libraryLinks
      .map((item) => {
        const cleanedUrl = item.url.trim();
        if (!cleanedUrl) return null;
        return {
          name: item.name.trim() || inferLibraryName(cleanedUrl),
          url: cleanedUrl,
        };
      })
      .filter((item): item is BookLibraryLink => item !== null);

    const payload = {
      ...formData,
      coverUrl: formData.coverUrl.trim(),
      downloadsLabel: formData.downloadsLabel.trim(),
      link: cleanedLinks[0]?.url || "",
      libraryLinks: cleanedLinks,
      topics: topicsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) router.push("/admin/books");
    } catch (error) {
      console.error("Failed to save", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Typography variant="h4" fontWeight="bold" mb={4}>
        {isNew ? "Add Book" : "Edit Book"}
      </Typography>

      <Paper className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-56 aspect-video bg-gray-900 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative overflow-hidden shrink-0">
              {formData.coverUrl ? (
                <img src={formData.coverUrl} alt="Cover" className="w-full h-full object-contain" />
              ) : (
                <FaImage className="text-gray-400 text-3xl" />
              )}
              <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-black/60 flex items-center justify-center transition-opacity cursor-pointer">
                <CloudinaryUploadButton
                  signatureEndpoint="/api/sign-cloudinary-params"
                  onSuccess={(result: any) =>
                    setFormData({ ...formData, coverUrl: result?.info?.secure_url || "" })
                  }
                  className="text-white text-xs font-bold w-full h-full flex items-center justify-center p-4"
                >
                  Upload Cover
                </CloudinaryUploadButton>
              </div>
            </div>

            <TextField
              fullWidth
              label="Cover Image URL"
              value={formData.coverUrl}
              onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
              helperText="Upload a cover or paste a direct image URL (supports both wide and portrait covers)"
            />
          </div>

          <Divider />

          <TextField
            fullWidth
            label="Book Title (English)"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Title (German)"
              value={formData.title_de}
              onChange={(e) => setFormData({ ...formData, title_de: e.target.value })}
            />
            <TextField
              fullWidth
              label="Title (Arabic)"
              dir="rtl"
              value={formData.title_ar}
              onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
            />
          </div>

          <TextField
            fullWidth
            label="Subtitle / Edition Tag (English)"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Subtitle (German)"
              value={formData.subtitle_de}
              onChange={(e) => setFormData({ ...formData, subtitle_de: e.target.value })}
            />
            <TextField
              fullWidth
              label="Subtitle (Arabic)"
              dir="rtl"
              value={formData.subtitle_ar}
              onChange={(e) => setFormData({ ...formData, subtitle_ar: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Topics / Keywords (comma separated)"
              placeholder="C++, Game Dev, Unreal Engine, Arabic"
              value={topicsInput}
              onChange={(e) => setTopicsInput(e.target.value)}
            />
            <TextField
              fullWidth
              label="Reach / Publication Highlight (optional)"
              placeholder="e.g. Arabic Open Access · Kotobati & Noor Book"
              value={formData.downloadsLabel}
              onChange={(e) => setFormData({ ...formData, downloadsLabel: e.target.value })}
            />
          </div>

          <Divider />

          <Box className="rounded-lg border border-gray-200 bg-gray-50/70 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <Typography variant="subtitle1" fontWeight="bold">
                  Published Library Links
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Add every library or bookstore where this book is published. The first URL also acts as the primary fallback link.
                </Typography>
              </div>
              <Button
                type="button"
                size="small"
                variant="outlined"
                startIcon={<FaPlus />}
                onClick={() => handleAddLibraryRow("")}
              >
                Add Library
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <Typography variant="caption" color="text.secondary" className="mr-1">
                Quick add:
              </Typography>
              {LIBRARY_PRESETS.map((preset) => (
                <Chip
                  key={preset}
                  label={preset}
                  size="small"
                  variant="outlined"
                  onClick={() => handleAddLibraryRow(preset)}
                />
              ))}
            </div>

            <div className="space-y-3 pt-1">
              {libraryLinks.map((item, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                  <div className="md:col-span-4">
                    <TextField
                      fullWidth
                      size="small"
                      label={`Library Name #${idx + 1}`}
                      placeholder="e.g. Kotobati, Noor Book, Google Books"
                      value={item.name}
                      onChange={(e) => handleLibraryChange(idx, "name", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-7">
                    <TextField
                      fullWidth
                      size="small"
                      label="Book URL"
                      placeholder="https://..."
                      value={item.url}
                      onChange={(e) => handleLibraryChange(idx, "url", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-1 flex justify-end">
                    <Button
                      type="button"
                      color="error"
                      variant="text"
                      aria-label={`Remove library link ${idx + 1}`}
                      onClick={() => handleRemoveLibraryRow(idx)}
                      className="min-w-0 p-2"
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Box>

          <Divider />

          <TextField
            fullWidth
            multiline
            rows={5}
            label="Description (English)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              multiline
              rows={5}
              label="Description (German)"
              value={formData.description_de}
              onChange={(e) => setFormData({ ...formData, description_de: e.target.value })}
            />
            <TextField
              fullWidth
              multiline
              rows={5}
              label="Description (Arabic)"
              value={formData.description_ar}
              onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
              dir="rtl"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" variant="contained" className="bg-black hover:bg-gray-800">
              Save
            </Button>
            <Button variant="outlined" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
}
