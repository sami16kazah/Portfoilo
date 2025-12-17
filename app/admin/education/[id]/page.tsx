"use client";

import { useState, use, useEffect } from "react";
import { 
  Box, Typography, Button, TextField, Paper 
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function EducationForm({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const isNew = id === "new";

  const [formData, setFormData] = useState({
    degree: "",
    degree_de: "",
    degree_ar: "",
    institution: "",
    institution_de: "",
    institution_ar: "",
    year: "",
    description: "",
    description_de: "",
    description_ar: "",
  });

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/education/${id}`)
        .then(res => res.json())
        .then(data => setFormData({
          degree: data.degree || "",
          degree_de: data.degree_de || "",
          degree_ar: data.degree_ar || "",
          institution: data.institution || "",
          institution_de: data.institution_de || "",
          institution_ar: data.institution_ar || "",
          year: data.year || "",
          description: data.description || "",
          description_de: data.description_de || "",
          description_ar: data.description_ar || "",
        }))
        .catch(err => console.error(err));
    }
  }, [id, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isNew ? "POST" : "PUT";
    const url = isNew ? "/api/education" : `/api/education/${id}`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) router.push("/admin/education");
    } catch (error) {
      console.error("Failed to save", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Typography variant="h4" fontWeight="bold" mb={4}>
        {isNew ? "Add Education" : "Edit Education"}
      </Typography>

      <Paper className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="Degree (English)"
            value={formData.degree}
            onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
            required
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Degree (German)"
              value={formData.degree_de}
              onChange={(e) => setFormData({ ...formData, degree_de: e.target.value })}
            />
            <TextField
              fullWidth
              label="Degree (Arabic)"
              dir="rtl"
              value={formData.degree_ar}
              onChange={(e) => setFormData({ ...formData, degree_ar: e.target.value })}
            />
          </div>
          
          <TextField
            fullWidth
            label="Institution (English)"
            value={formData.institution}
            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            required
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Institution (German)"
              value={formData.institution_de}
              onChange={(e) => setFormData({ ...formData, institution_de: e.target.value })}
            />
            <TextField
              fullWidth
              label="Institution (Arabic)"
              dir="rtl"
              value={formData.institution_ar}
              onChange={(e) => setFormData({ ...formData, institution_ar: e.target.value })}
            />
          </div>
          
          <TextField
            fullWidth
            label="Year"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          />
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Description (English)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
             <TextField
                fullWidth
                multiline
                rows={2}
                label="Description (German)"
                value={formData.description_de}
                onChange={(e) => setFormData({ ...formData, description_de: e.target.value })}
              />
              <TextField
                fullWidth
                multiline
                rows={2}
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
