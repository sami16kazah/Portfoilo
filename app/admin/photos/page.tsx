"use client";

import { useState, useEffect } from "react";
import { 
  Box, Typography, Button, TextField, Grid, Card, CardMedia, IconButton, Container 
} from "@mui/material";
import { FaTrash, FaPlus } from "react-icons/fa";
import { CldUploadButton } from "next-cloudinary";

interface Photo {
  _id: string;
  url: string;
  title: string;
  category: string;
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const res = await fetch("/api/photos");
      if (res.ok) setPhotos(await res.json());
    } catch (error) {
      console.error("Failed to fetch photos", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (result: any) => {
    if (result?.info?.secure_url) {
      const newPhoto = {
        url: result.info.secure_url,
        title: "New Photo",
        category: "General"
      };
      
      try {
        const res = await fetch("/api/photos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPhoto),
        });
        
        if (res.ok) {
          const savedPhoto = await res.json();
          setPhotos([savedPhoto, ...photos]);
        }
      } catch (error) {
        console.error("Failed to save photo", error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this photo?")) return;
    try {
      await fetch(`/api/photos/${id}`, { method: "DELETE" });
      setPhotos(photos.filter(p => p._id !== id));
    } catch (error) {
      console.error("Failed to delete photo", error);
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <Typography variant="h4" fontWeight="bold">Photo Gallery</Typography>
        <div className="bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-800 transition cursor-pointer">
           <CldUploadButton 
              signatureEndpoint="/api/sign-cloudinary-params"
              onSuccess={handleUpload}
              className="flex items-center gap-2 font-medium"
            >
              <FaPlus /> Upload Photo
            </CldUploadButton>
        </div>
      </div>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Grid container spacing={3}>
          {photos.map((photo) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={photo._id}>
              <Card className="relative group">
                <CardMedia
                  component="img"
                  height="200"
                  image={photo.url}
                  alt={photo.title}
                  className="h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                   <IconButton 
                      color="error" 
                      onClick={() => handleDelete(photo._id)}
                      className="bg-white/10 hover:bg-red-600 hover:text-white"
                   >
                     <FaTrash />
                   </IconButton>
                </div>
              </Card>
            </Grid>
          ))}
          {photos.length === 0 && (
            <Grid size={{ xs: 12 }}>
              <Box p={4} textAlign="center" sx={{ border: '2px dashed', borderColor: 'divider', borderRadius: 2 }}>
                <Typography color="text.secondary">No photos yet. Upload some!</Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </div>
  );
}
