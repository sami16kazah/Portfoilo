"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { 
  Box, Button, TextField, Typography, Paper,
  FormControlLabel, Switch, Chip
} from "@mui/material";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import { CldUploadButton } from "next-cloudinary";

export default function ProjectForm({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params); 
  const isNew = resolvedParams.id === "new";
  
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    title_de: "",
    title_ar: "",
    description: "",
    description_de: "",
    description_ar: "",
    tags: "",
    repoUrl: "",
    demoUrl: "",
    videoUrl: "",
    imageUrl: "",
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
      const res = await fetch(`/api/projects/${id}`);
      const data = await res.json();
      setFormData({
        ...data,
        description: Array.isArray(data.description) ? data.description.join("\n") : data.description || "",
        description_de: Array.isArray(data.description_de) ? data.description_de.join("\n") : data.description_de || "",
        description_ar: Array.isArray(data.description_ar) ? data.description_ar.join("\n") : data.description_ar || "",
        tags: Array.isArray(data.tags) ? data.tags.join(", ") : data.tags || "",
      });
    } catch (error) {
      console.error("Failed to fetch project", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, featured: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      description: formData.description.split("\n").filter(line => line.trim() !== ""),
      description_de: formData.description_de.split("\n").filter(line => line.trim() !== ""),
      description_ar: formData.description_ar.split("\n").filter(line => line.trim() !== ""),
      tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag !== ""),
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
      }
    } catch (error) {
      console.error("Failed to save project", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          startIcon={<FaArrowLeft />} 
          onClick={() => router.back()}
          color="inherit"
        >
          Back
        </Button>
        <Typography variant="h4" component="h1" fontWeight="bold">
          {isNew ? "Add New Project" : "Edit Project"}
        </Typography>
      </div>

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
             <TextField
               label="Project Title (German)"
               name="title_de"
               fullWidth
               value={formData.title_de}
               onChange={handleChange}
             />
             <TextField
               label="Project Title (Arabic)"
               name="title_ar"
               fullWidth
               dir="rtl"
               value={formData.title_ar}
               onChange={handleChange}
             />
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
             <TextField
               label="Description (German)"
               name="description_de"
               fullWidth
               multiline
               rows={4}
               value={formData.description_de}
               onChange={handleChange}
             />
             <TextField
               label="Description (Arabic)"
               name="description_ar"
               fullWidth
               multiline
               rows={4}
               dir="rtl"
               value={formData.description_ar}
               onChange={handleChange}
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <TextField
              label="Date (e.g., Jan 2025)"
              name="date"
              fullWidth
              value={formData.date}
              onChange={handleChange}
            />
            <TextField
              label="Tags (comma separated)"
              name="tags"
              fullWidth
              value={formData.tags}
              onChange={handleChange}
              helperText="e.g., React, Next.js, MongoDB"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField
              label="Repository URL"
              name="repoUrl"
              fullWidth
              value={formData.repoUrl}
              onChange={handleChange}
            />
            <TextField
              label="Demo URL"
              name="demoUrl"
              fullWidth
              value={formData.demoUrl}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-4 items-end">
            <TextField
              fullWidth
              label="Image URL"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
            <CldUploadButton
                signatureEndpoint="/api/sign-cloudinary-params"
                onSuccess={(result: any) => setFormData({...formData, imageUrl: result?.info?.secure_url})}
                className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-3 rounded font-medium whitespace-nowrap"
            >
                Upload Image
            </CldUploadButton>
          </div>

          <div className="flex gap-4 items-end">
            <TextField
              fullWidth
              label="Video URL"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            />
             <CldUploadButton
                signatureEndpoint="/api/sign-cloudinary-params"
                onSuccess={(result: any) => setFormData({...formData, videoUrl: result?.info?.secure_url})}
                className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-3 rounded font-medium whitespace-nowrap"
            >
                Upload Video
            </CldUploadButton>
          </div>

          <FormControlLabel
            control={
              <Switch
                checked={formData.featured}
                onChange={handleSwitchChange}
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
              sx={{ bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}
            >
              {loading ? "Saving..." : "Save Project"}
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
}
