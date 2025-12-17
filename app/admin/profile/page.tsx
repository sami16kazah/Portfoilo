"use client";

import { useEffect, useState } from "react";
import { 
  Box, Button, TextField, Typography, Paper, 
  Grid, Divider, IconButton, MenuItem, Select, FormControl, InputLabel
} from "@mui/material";
import { FaSave, FaUserCircle, FaTrash, FaPlus } from "react-icons/fa";
import { CldUploadButton } from "next-cloudinary";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    name_de: "",
    name_ar: "",
    title: "",
    title_de: "",
    title_ar: "",
    bio: "", // English
    bio_de: "",
    bio_ar: "",
    email: "",
    phone: "",
    socialLinks: {
      github: "",
      linkedin: "",
      twitter: "",
      instagram: "",
    },
    cvUrl: "",
    avatarUrl: "",
    languages: [] as { name: string; name_de: string; name_ar: string; proficiency: string }[],
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      setFormData({
        ...data,
        name: data.name || "",
        name_de: data.name_de || "",
        name_ar: data.name_ar || "",
        bio: Array.isArray(data.bio) ? data.bio.join("\n\n") : data.bio || "",
        bio_de: Array.isArray(data.bio_de) ? data.bio_de.join("\n\n") : data.bio_de || "",
        bio_ar: Array.isArray(data.bio_ar) ? data.bio_ar.join("\n\n") : data.bio_ar || "",
        languages: data.languages || [],
      });
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("social.")) {
      const socialKey = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [socialKey]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleUploadSuccess = (result: any, field: string) => {
    if (result?.info?.secure_url) {
      setFormData(prev => ({ ...prev, [field]: result.info.secure_url }));
    }
  };

  // Language Handlers
  const addLanguage = () => {
    setFormData(prev => ({
      ...prev,
      languages: [...prev.languages, { name: "", name_de: "", name_ar: "", proficiency: "Intermediate" }]
    }));
  };

  const removeLanguage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  const handleLanguageChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newLanguages = [...prev.languages];
      newLanguages[index] = { ...newLanguages[index], [field]: value };
      return { ...prev, languages: newLanguages };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      bio: formData.bio.split("\n\n").filter(p => p.trim() !== ""),
      bio_de: formData.bio_de.split("\n\n").filter(p => p.trim() !== ""),
      bio_ar: formData.bio_ar.split("\n\n").filter(p => p.trim() !== ""),
    };

    try {
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Typography variant="h4" fontWeight="bold">Personal Info</Typography>
      </div>

      <Paper className="p-8 radius-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-6 items-start">
             <div className="space-y-2 text-center">
                 <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 relative group">
                    {formData.avatarUrl ? (
                      <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <FaUserCircle className="w-full h-full text-gray-300" />
                    )}
                 </div>
                 <CldUploadButton 
                    signatureEndpoint="/api/sign-cloudinary-params"
                    onSuccess={(result) => handleUploadSuccess(result, 'avatarUrl')}
                    className="text-sm text-blue-600 hover:underline"
                 >
                    Upload Photo
                 </CldUploadButton>
             </div>
             
             <div className="flex-1 space-y-6">
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Full Name (English)"
                      name="name"
                      fullWidth
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Name (German)"
                      name="name_de"
                      fullWidth
                      value={formData.name_de}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Name (Arabic)"
                      name="name_ar"
                      fullWidth
                      dir="rtl"
                      value={formData.name_ar}
                      onChange={handleChange}
                    />
                  </Grid>
                   <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Email"
                      name="email"
                      fullWidth
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </Grid>
                   <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Phone"
                      name="phone"
                      fullWidth
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
             </div>
          </div>

          <Divider />
          <Typography variant="h6">Titles</Typography>
          <Grid container spacing={3}>
               <Grid size={{ xs: 12, md: 4 }}>
                 <TextField
                   label="Job Title (EN)"
                   name="title"
                   fullWidth
                   value={formData.title}
                   onChange={handleChange}
                 />
               </Grid>
               <Grid size={{ xs: 12, md: 4 }}>
                 <TextField
                   label="Job Title (DE)"
                   name="title_de"
                   fullWidth
                   value={formData.title_de}
                   onChange={handleChange}
                 />
               </Grid>
               <Grid size={{ xs: 12, md: 4 }}>
                 <TextField
                   label="Job Title (AR)"
                   name="title_ar"
                   fullWidth
                   dir="rtl"
                   value={formData.title_ar}
                   onChange={handleChange}
                 />
               </Grid>
          </Grid>

          <Divider />
          <Typography variant="h6">Bios</Typography>
          <Grid container spacing={3}>
             <Grid size={{ xs: 12 }}>
               <TextField
                 label="Bio (English) - Double enter for paragraphs"
                 name="bio"
                 fullWidth
                 multiline
                 rows={4}
                 value={formData.bio}
                 onChange={handleChange}
               />
             </Grid>
             <Grid size={{ xs: 12, md: 6 }}>
               <TextField
                 label="Bio (German)"
                 name="bio_de"
                 fullWidth
                 multiline
                 rows={4}
                 value={formData.bio_de}
                 onChange={handleChange}
               />
             </Grid>
             <Grid size={{ xs: 12, md: 6 }}>
               <TextField
                 label="Bio (Arabic)"
                 name="bio_ar"
                 fullWidth
                 multiline
                 rows={4}
                 dir="rtl"
                 value={formData.bio_ar}
                 onChange={handleChange}
               />
             </Grid>
          </Grid>
          
          <Divider />
          <div className="flex justify-between items-center">
            <Typography variant="h6">Spoken Languages</Typography>
            <Button startIcon={<FaPlus />} onClick={addLanguage} size="small" variant="outlined">
                Add Language
            </Button>
          </div>
          <div className="space-y-4">
             {formData.languages.map((lang, index) => (
                <div key={index} className="flex gap-4 items-center bg-gray-50 p-4 rounded border">
                    <TextField
                        label="Language (EN)"
                        value={lang.name}
                        onChange={(e) => handleLanguageChange(index, 'name', e.target.value)}
                        size="small"
                        className="flex-1"
                    />
                     <TextField
                        label="Language (DE)"
                        value={lang.name_de}
                        onChange={(e) => handleLanguageChange(index, 'name_de', e.target.value)}
                        size="small"
                        className="flex-1"
                    />
                     <TextField
                        label="Language (AR)"
                        value={lang.name_ar}
                        onChange={(e) => handleLanguageChange(index, 'name_ar', e.target.value)}
                        size="small"
                        className="flex-1"
                        dir="rtl"
                    />
                    <FormControl size="small" className="w-[150px]">
                        <InputLabel>Proficiency</InputLabel>
                        <Select
                            value={lang.proficiency}
                            label="Proficiency"
                            onChange={(e) => handleLanguageChange(index, 'proficiency', e.target.value)}
                        >
                            <MenuItem value="Native">Native</MenuItem>
                            <MenuItem value="Fluent">Fluent</MenuItem>
                            <MenuItem value="Advanced">Advanced</MenuItem>
                            <MenuItem value="Intermediate">Intermediate</MenuItem>
                            <MenuItem value="Beginner">Beginner</MenuItem>
                        </Select>
                    </FormControl>
                    <IconButton onClick={() => removeLanguage(index)} color="error">
                        <FaTrash />
                    </IconButton>
                </div>
             ))}
          </div>


          <Divider />
          <Typography variant="h6">Social Links</Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="GitHub URL"
                name="social.github"
                fullWidth
                value={formData.socialLinks.github}
                onChange={handleChange}
              />
            </Grid>
             <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="LinkedIn URL"
                name="social.linkedin"
                fullWidth
                value={formData.socialLinks.linkedin}
                onChange={handleChange}
              />
            </Grid>
             <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Twitter URL"
                name="social.twitter"
                fullWidth
                value={formData.socialLinks.twitter}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Instagram URL"
                name="social.instagram"
                fullWidth
                value={formData.socialLinks.instagram}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Divider />
          <div className="flex gap-4 items-center">
             <TextField
                label="CV URL"
                name="cvUrl"
                fullWidth
                value={formData.cvUrl}
                onChange={handleChange}
              />
               <CldUploadButton 
                    signatureEndpoint="/api/sign-cloudinary-params"
                    onSuccess={(result) => handleUploadSuccess(result, 'cvUrl')}
                    className="px-4 py-3 bg-gray-200 rounded hover:bg-gray-300 whitespace-nowrap"
                 >
                    Upload CV
                 </CldUploadButton>
          </div>

          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            size="large"
            disabled={loading}
            startIcon={<FaSave />}
            sx={{ bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}
          >
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </Paper>
    </div>
  );
}
