"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { 
  Box, Button, TextField, Typography, Paper, 
  Slider, MenuItem, Select, InputLabel, FormControl, Chip
} from "@mui/material";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import CloudinaryUploadButton from "@/components/admin/CloudinaryUploadButton";

const ICON_PRESETS = [
  { label: "AWS", value: "SiAmazonwebservices" },
  { label: "EC2", value: "SiAmazonec2" },
  { label: "S3", value: "SiAmazons3" },
  { label: "RDS", value: "SiAmazonrds" },
  { label: "Lambda", value: "SiAwslambda" },
  { label: "IAM", value: "SiAmazoniam" },
  { label: "CloudWatch", value: "SiAmazoncloudwatch" },
  { label: "Route 53", value: "SiAmazonroute53" },
  { label: "API Gateway", value: "SiAmazonapigateway" },
  { label: "DynamoDB", value: "SiAmazondynamodb" },
  { label: "ECS", value: "SiAmazonecs" },
  { label: "Fargate", value: "SiAwsfargate" },
];

export default function SkillForm({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const isNew = resolvedParams.id === "new";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    name_de: "",
    name_ar: "",
    category: "Frontend",
    icon: "",
    proficiency: 50,
  });

  useEffect(() => {
    if (!isNew) fetchSkill(resolvedParams.id);
  }, [isNew, resolvedParams.id]);

  const fetchSkill = async (id: string) => {
    const res = await fetch(`/api/skills/${id}`);
    if (res.ok) {
      const data = await res.json();
      setFormData({
        name: data.name || "",
        name_de: data.name_de || "",
        name_ar: data.name_ar || "",
        category: data.category || "Frontend",
        icon: data.icon || "",
        proficiency: data.proficiency || 50,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = isNew ? "/api/skills" : `/api/skills/${resolvedParams.id}`;
    const method = isNew ? "POST" : "PUT";
    
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    
    router.push("/admin/skills");
    router.refresh();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button startIcon={<FaArrowLeft />} onClick={() => router.back()} color="inherit">Back</Button>
        <Typography variant="h4" fontWeight="bold">{isNew ? "Add Skill" : "Edit Skill"}</Typography>
      </div>

      <Paper className="p-8 radius-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <TextField
            label="Skill Name (English)"
            fullWidth
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <TextField
               label="Name (German)"
               fullWidth
               value={formData.name_de}
               onChange={(e) => setFormData({ ...formData, name_de: e.target.value })}
             />
             <TextField
               label="Name (Arabic)"
               fullWidth
               dir="rtl"
               value={formData.name_ar}
               onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
             />
           </div>

          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              label="Category"
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <MenuItem value="Cloud">Cloud (AWS)</MenuItem>
              <MenuItem value="Frontend">Frontend</MenuItem>
              <MenuItem value="Backend">Backend</MenuItem>
              <MenuItem value="Database">Database</MenuItem>
              <MenuItem value="Languages">Languages</MenuItem>
              <MenuItem value="DevOps">DevOps</MenuItem>
              <MenuItem value="Tools">Tools</MenuItem>
              <MenuItem value="Soft Skills">Soft Skills</MenuItem>
            </Select>
          </FormControl>

          <div className="space-y-2">
            <div className="flex gap-4 items-end">
               <TextField
                 label="React Icon Name (e.g., SiAmazonwebservices) or URL"
                 fullWidth
                 value={formData.icon}
                 onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                 helperText="Choose a quick AWS icon below, enter a supported icon name, or upload an image"
               />
                <CloudinaryUploadButton 
                   signatureEndpoint="/api/sign-cloudinary-params" 
                   onSuccess={(result: any) => setFormData({...formData, icon: result?.info?.secure_url})}
                   className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-3 rounded font-medium whitespace-nowrap mb-6"
                >
                   Upload
                </CloudinaryUploadButton>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <Typography variant="caption" color="text.secondary" className="mr-1">
                AWS icon presets:
              </Typography>
              {ICON_PRESETS.map((preset) => (
                <Chip
                  key={preset.value}
                  label={preset.label}
                  size="small"
                  variant={formData.icon === preset.value ? "filled" : "outlined"}
                  color={formData.icon === preset.value ? "primary" : "default"}
                  onClick={() => setFormData({ ...formData, icon: preset.value })}
                />
              ))}
            </div>
          </div>

          <Box>
            <Typography gutterBottom>Proficiency ({formData.proficiency}%)</Typography>
            <Slider
              value={formData.proficiency}
              onChange={(_, val) => setFormData({ ...formData, proficiency: val as number })}
              valueLabelDisplay="auto"
            />
          </Box>

          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            size="large"
            disabled={loading}
            startIcon={<FaSave />}
            sx={{ bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}
          >
            {loading ? "Saving..." : "Save Skill"}
          </Button>
        </form>
      </Paper>
    </div>
  );
}
