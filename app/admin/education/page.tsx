"use client";

import { useState, useEffect } from "react";
import { 
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton 
} from "@mui/material";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Link from "next/link";

interface Education {
  _id: string;
  degree: string;
  institution: string;
  year: string;
}

export default function EducationPage() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    try {
      await fetch(`/api/education/${id}`, { method: "DELETE" });
      setEducation(education.filter(e => e._id !== id));
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h4" fontWeight="bold">Education</Typography>
        <Button 
          component={Link} 
          href="/admin/education/new" 
          variant="contained" 
          startIcon={<FaPlus />}
          className="bg-black hover:bg-gray-800"
        >
          Add Education
        </Button>
      </div>

      <TableContainer component={Paper}>
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
                  <IconButton component={Link} href={`/admin/education/${edu._id}`} color="primary">
                    <FaEdit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(edu._id)} color="error">
                    <FaTrash />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {education.length === 0 && !loading && (
               <TableRow><TableCell colSpan={4} align="center">No education found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
