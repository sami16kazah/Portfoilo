"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Button, IconButton, Chip, 
  Typography, Box, CircularProgress, LinearProgress 
} from "@mui/material";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency: number;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/skills");
      const data = await res.json();
      setSkills(data);
    } catch (error) {
      console.error("Failed to fetch skills", error);
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
      const res = await fetch(`/api/skills/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setSkills(skills.filter(s => s._id !== deleteId));
    } catch (error) {
      console.error("Failed to delete", error);
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) return <Box p={4} display="flex" justifyContent="center"><CircularProgress /></Box>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h4" component="h1" fontWeight="bold">Skills</Typography>
        <Link href="/admin/skills/new">
          <Button variant="contained" startIcon={<FaPlus />} sx={{ bgcolor: 'black' }}>
            Add Skill
          </Button>
        </Link>
      </div>

      <TableContainer component={Paper} elevation={0} className="border rounded-lg">
        <Table>
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell className="font-semibold">Name</TableCell>
              <TableCell className="font-semibold">Category</TableCell>
              <TableCell className="font-semibold">Proficiency</TableCell>
              <TableCell align="right" className="font-semibold">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {skills.map((skill) => (
              <TableRow key={skill._id}>
                <TableCell className="font-medium">{skill.name}</TableCell>
                <TableCell><Chip label={skill.category} size="small" /></TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress variant="determinate" value={skill.proficiency} />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography variant="body2" color="text.secondary">{`${Math.round(skill.proficiency)}%`}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/skills/${skill._id}`}>
                      <IconButton color="primary" size="small"><FaEdit /></IconButton>
                    </Link>
                    <IconButton color="error" size="small" onClick={() => handleDeleteClick(skill._id)}><FaTrash /></IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Skill"
        description="Are you sure you want to delete this skill?"
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
}
