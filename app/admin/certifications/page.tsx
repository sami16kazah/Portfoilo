"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton
} from "@mui/material";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
interface Certification {
  _id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
}
export default function CertificationsPage() {
  const router = useRouter();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchCertifications();
  }, []);
  const fetchCertifications = async () => {
    try {
      const res = await fetch("/api/certifications");
      if (res.ok) setCertifications(await res.json());
    } catch (error) {
      console.error("Failed to fetch certifications", error);
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
      const res = await fetch(`/api/certifications/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setCertifications(certifications.filter(c => c._id !== deleteId));
    } catch (error) {
      console.error("Failed to delete", error);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h4" fontWeight="bold">Certifications</Typography>
        <Button
          variant="contained"
          startIcon={<FaPlus />}
          onClick={() => router.push("/admin/certifications/new")}
          sx={{ bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}
        >
          Add Certification
        </Button>
      </div>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Issuer</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {certifications.map((cert) => (
                <TableRow key={cert._id}>
                  <TableCell>{cert.name}</TableCell>
                  <TableCell>{cert.issuer}</TableCell>
                  <TableCell>{cert.date}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => router.push(`/admin/certifications/${cert._id}`)} color="primary">
                      <FaEdit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(cert._id)} color="error">
                      <FaTrash />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Certification"
        description="Are you sure you want to delete this certification?"
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
}
