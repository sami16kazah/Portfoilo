"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button, 
  IconButton,
  Chip,
  Typography,
  Box,
  CircularProgress
} from "@mui/material";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

interface Project {
  _id: string;
  title: string;
  tags: string[];
  date: string;
  featured: boolean;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setLoading(false);
    }
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    
    try {
      const res = await fetch(`/api/projects/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setProjects(projects.filter(p => p._id !== deleteId));
    } catch (error) {
      console.error("Failed to delete project", error);
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) return <Box p={4} display="flex" justifyContent="center"><CircularProgress /></Box>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h4" component="h1" fontWeight="bold">
          Projects
        </Typography>
        <Link href="/admin/projects/new">
          <Button 
            variant="contained" 
            startIcon={<FaPlus />}
            sx={{ 
              bgcolor: 'black', 
              '&:hover': { bgcolor: '#333' } 
            }}
          >
            Add New Project
          </Button>
        </Link>
      </div>

      <TableContainer component={Paper} elevation={0} className="border rounded-lg overflow-hidden">
        <Table sx={{ minWidth: 650 }}>
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell className="font-semibold">Title</TableCell>
              <TableCell className="font-semibold">Tags</TableCell>
              <TableCell className="font-semibold">Date</TableCell>
              <TableCell className="font-semibold">Status</TableCell>
              <TableCell align="right" className="font-semibold">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" className="py-8 text-gray-500">
                  No projects found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project._id} hover>
                  <TableCell className="font-medium text-lg">{project.title}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {project.tags.map((tag, i) => (
                        <Chip key={i} label={tag} size="small" variant="outlined" />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{project.date}</TableCell>
                  <TableCell>
                    {project.featured ? (
                      <Chip label="Featured" color="primary" size="small" />
                    ) : (
                      <Chip label="Standard" size="small" />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/projects/${project._id}`}>
                        <IconButton color="primary" size="small">
                          <FaEdit />
                        </IconButton>
                      </Link>
                      <IconButton 
                        color="error" 
                        size="small" 
                        onClick={() => handleDeleteClick(project._id)}
                      >
                        <FaTrash />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete Project"
        isDestructive={true}
      />
    </div>
  );
}
