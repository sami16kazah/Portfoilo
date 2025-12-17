"use client";
import { useState, use, useEffect } from "react";
import { 
  Box, Typography, Button, TextField, Paper 
} from "@mui/material";
import { useRouter } from "next/navigation";
export default function CertificationForm({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const isNew = id === "new";
  const [formData, setFormData] = useState({
    name: "",
    name_de: "",
    name_ar: "",
    issuer: "",
    date: "",
    link: "",
  });
  useEffect(() => {
    if (!isNew) {
      fetch(`/api/certifications/${id}`)
        .then(res => res.json())
        .then(data => setFormData({
          name: data.name || "",
          name_de: data.name_de || "",
          name_ar: data.name_ar || "",
          issuer: data.issuer || "",
          date: data.date || "",
          link: data.link || "",
        }))
        .catch(err => console.error(err));
    }
  }, [id, isNew]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isNew ? "POST" : "PUT";
    const url = isNew ? "/api/certifications" : `/api/certifications/${id}`;
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) router.push("/admin/certifications");
    } catch (error) {
      console.error("Failed to save", error);
    }
  };
  return (
    <div className="max-w-2xl mx-auto">
      <Typography variant="h4" fontWeight="bold" mb={4}>
        {isNew ? "Add Certification" : "Edit Certification"}
      </Typography>
      <Paper className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="Certification Name (English)"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Name (German)"
              value={formData.name_de}
              onChange={(e) => setFormData({ ...formData, name_de: e.target.value })}
            />
            <TextField
              fullWidth
              label="Name (Arabic)"
              dir="rtl"
              value={formData.name_ar}
              onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
            />
          </div>
          <TextField
            fullWidth
            label="Issuing Organization"
            value={formData.issuer}
            onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Date (e.g., Jan 2024)"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <TextField
            fullWidth
            label="Certificate Link (URL)"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          />
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
}