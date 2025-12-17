"use client";

import { useState, use, useEffect } from "react";
import { 
  Box, Typography, Button, TextField, Paper 
} from "@mui/material";
import { useRouter } from "next/navigation";
import { CldUploadButton } from "next-cloudinary";
import { FaImage } from "react-icons/fa";

export default function BookForm({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use( params);
  const isNew = id === "new";

  const [formData, setFormData] = useState({
    title: "",
    title_de: "",
    title_ar: "",
    coverUrl: "",
    link: "",
    description: "",
    description_de: "",
    description_ar: "",
  });

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/books/${id}`)
        .then(res => res.json())
        .then(data => setFormData({
          title: data.title || "",
          title_de: data.title_de || "",
          title_ar: data.title_ar || "",
          coverUrl: data.coverUrl || "",
          link: data.link || "",
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
    const url = isNew ? "/api/books" : `/api/books/${id}`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) router.push("/admin/books");
    } catch (error) {
      console.error("Failed to save", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Typography variant="h4" fontWeight="bold" mb={4}>
        {isNew ? "Add Book" : "Edit Book"}
      </Typography>

      <Paper className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center mb-6">
             <div className="w-32 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded flex items-center justify-center relative overflow-hidden">
                {formData.coverUrl ? (
                   <img src={formData.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                   <FaImage className="text-gray-400 text-3xl" />
                )}
                 <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-black/50 flex items-center justify-center transition-opacity cursor-pointer">
              <CldUploadButton 
                 signatureEndpoint="/api/sign-cloudinary-params"
                 onSuccess={(result: any) => setFormData({...formData, coverUrl: result?.info?.secure_url})}
                 className="text-white text-xs font-bold w-full h-full flex items-center justify-center p-4"
              >
                 Upload Cover
              </CldUploadButton>
                 </div>
             </div>
          </div>

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
            label="External Link"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          />
         
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description (English)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
             <TextField
                fullWidth
                multiline
                rows={3}
                label="Description (German)"
                value={formData.description_de}
                onChange={(e) => setFormData({ ...formData, description_de: e.target.value })}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
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
