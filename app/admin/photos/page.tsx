"use client";

import { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { FaEdit, FaPlus, FaSave, FaTimes, FaTrash } from "react-icons/fa";
import CloudinaryUploadButton from "@/components/admin/CloudinaryUploadButton";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

interface Photo {
  _id: string;
  url: string;
  title: string;
  category: string;
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Work");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const res = await fetch("/api/photos", { cache: "no-store" });
      if (res.ok) setPhotos(await res.json());
    } catch (error) {
      console.error("Failed to fetch photos", error);
      setFeedback({ type: "error", text: "Failed to load gallery photos." });
    } finally {
      setLoading(false);
    }
  };

  const saveNewPhoto = async (payload: { url: string; title: string; category: string }) => {
    setFeedback(null);
    try {
      const res = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setFeedback({ type: "error", text: json.error || "Failed to save photo." });
        return false;
      }
      setPhotos((prev) => [json, ...prev]);
      setFeedback({ type: "success", text: "Photo added to gallery." });
      return true;
    } catch {
      setFeedback({ type: "error", text: "Network error saving photo." });
      return false;
    }
  };

  const handleUpload = async (result: unknown) => {
    const secureUrl = (result as { info?: { secure_url?: string } })?.info?.secure_url;
    if (!secureUrl) return;
    await saveNewPhoto({
      url: secureUrl,
      title: newTitle.trim() || "Portfolio Photo",
      category: newCategory.trim() || "Work",
    });
  };

  const handleAddByUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    const ok = await saveNewPhoto({
      url: newUrl.trim(),
      title: newTitle.trim() || "Portfolio Photo",
      category: newCategory.trim() || "Work",
    });
    if (ok) {
      setNewUrl("");
      setNewTitle("");
    }
  };

  const startEdit = (photo: Photo) => {
    setEditingId(photo._id);
    setEditTitle(photo.title || "");
    setEditCategory(photo.category || "");
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/photos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle.trim(), category: editCategory.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        setFeedback({ type: "error", text: json.error || "Failed to update photo." });
        return;
      }
      setPhotos((prev) => prev.map((p) => (p._id === id ? json : p)));
      setEditingId(null);
      setFeedback({ type: "success", text: "Photo details updated." });
    } catch {
      setFeedback({ type: "error", text: "Failed to update photo." });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/photos/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setPhotos((prev) => prev.filter((p) => p._id !== deleteId));
      setFeedback({ type: "success", text: "Photo deleted." });
    } catch (error) {
      console.error("Failed to delete photo", error);
      setFeedback({ type: "error", text: "Failed to delete photo." });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <Typography variant="h4" fontWeight="bold">
          Photo Gallery
        </Typography>
        <div className="bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-800 transition cursor-pointer">
          <CloudinaryUploadButton
            signatureEndpoint="/api/sign-cloudinary-params"
            onSuccess={handleUpload}
            className="flex items-center gap-2 font-medium"
          >
            <FaPlus /> Upload Photo
          </CloudinaryUploadButton>
        </div>
      </div>

      {feedback && <Alert severity={feedback.type}>{feedback.text}</Alert>}

      <Paper className="p-4">
        <form onSubmit={handleAddByUrl} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-5">
            <TextField
              fullWidth
              size="small"
              label="Image Path or URL"
              placeholder="/assets/gallery/Img0.jpg or https://..."
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
          </div>
          <div className="md:col-span-3">
            <TextField
              fullWidth
              size="small"
              label="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <TextField
              fullWidth
              size="small"
              label="Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" variant="contained" fullWidth sx={{ bgcolor: "black" }}>
              Add URL
            </Button>
          </div>
        </form>
      </Paper>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Grid container spacing={3}>
          {photos.map((photo) => {
            const isEditing = editingId === photo._id;
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={photo._id}>
                <Card className="h-full flex flex-col">
                  <div className="relative group">
                    <CardMedia
                      component="img"
                      height="200"
                      image={photo.url}
                      alt={photo.title || "Gallery photo"}
                      className="h-52 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-1.5">
                      <IconButton
                        size="small"
                        onClick={() => startEdit(photo)}
                        sx={{ bgcolor: "rgba(255,255,255,0.9)" }}
                        aria-label="Edit photo"
                      >
                        <FaEdit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteId(photo._id)}
                        sx={{ bgcolor: "rgba(255,255,255,0.9)" }}
                        aria-label="Delete photo"
                      >
                        <FaTrash />
                      </IconButton>
                    </div>
                  </div>
                  <CardContent className="flex-1">
                    {isEditing ? (
                      <div className="space-y-2">
                        <TextField
                          fullWidth
                          size="small"
                          label="Title"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="Category"
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<FaSave />}
                            onClick={() => handleSaveEdit(photo._id)}
                          >
                            Save
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<FaTimes />}
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Typography variant="subtitle2" fontWeight="bold" noWrap>
                          {photo.title || "Untitled"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {photo.category || "General"}
                        </Typography>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
          {photos.length === 0 && (
            <Grid size={{ xs: 12 }}>
              <Box
                p={4}
                textAlign="center"
                sx={{ border: "2px dashed", borderColor: "divider", borderRadius: 2 }}
              >
                <Typography color="text.secondary">
                  No photos saved in MongoDB yet. Sync defaults from the Dashboard or upload new photos above.
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}

      <ConfirmationModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Photo"
        description="Are you sure you want to delete this photo from your gallery?"
        confirmText="Delete"
        isDestructive
      />
    </div>
  );
}
