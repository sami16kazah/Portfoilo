"use client";

import { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Link from "next/link";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

interface Education {
  _id: string;
  degree: string;
  institution: string;
  year: string;
}

export default function EducationPage() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const res = await fetch("/api/education");
      if (res.ok) setEducation(await res.json());
    } catch (error) {
      console.error("Failed to fetch education", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/education/${deleteId}`, { method: "DELETE" });
      setEducation((prev) => prev.filter((e) => e._id !== deleteId));
    } catch (error) {
      console.error("Failed to delete", error);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <Typography variant="h4" fontWeight={800}>
            Education
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage degrees and academic credentials shown on the public portfolio.
          </Typography>
        </div>
        <Button
          component={Link}
          href="/admin/education/new"
          variant="contained"
          color="primary"
          startIcon={<FaPlus />}
        >
          Add Education
        </Button>
      </div>

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Degree</TableCell>
              <TableCell>Institution</TableCell>
              <TableCell>Year</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {education.map((edu) => (
              <TableRow key={edu._id}>
                <TableCell>{edu.degree}</TableCell>
                <TableCell>{edu.institution}</TableCell>
                <TableCell>{edu.year}</TableCell>
                <TableCell align="right">
                  <IconButton component={Link} href={`/admin/education/${edu._id}`} color="secondary">
                    <FaEdit />
                  </IconButton>
                  <IconButton onClick={() => setDeleteId(edu._id)} color="error">
                    <FaTrash />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {education.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 5, color: "text.secondary" }}>
                  No education found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmationModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Education Entry"
        description="Are you sure you want to remove this education entry from your portfolio?"
        confirmText="Delete"
        isDestructive
      />
    </div>
  );
}
