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
  CircularProgress,
} from "@mui/material";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

interface JobItem {
  _id: string;
  company: string;
  role: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      if (Array.isArray(data)) setJobs(data);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/jobs/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setJobs(jobs.filter((j) => j._id !== deleteId));
    } catch (error) {
      console.error("Failed to delete job", error);
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <Box p={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h4" component="h1" fontWeight="bold">
          Work Experience &amp; Jobs
        </Typography>
        <Link href="/admin/jobs/new">
          <Button
            variant="contained"
            startIcon={<FaPlus />}
            sx={{ bgcolor: "black", "&:hover": { bgcolor: "#333" } }}
          >
            Add Job
          </Button>
        </Link>
      </div>

      <TableContainer component={Paper} elevation={0} className="border rounded-lg overflow-hidden">
        <Table sx={{ minWidth: 650 }}>
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell className="font-semibold">Company</TableCell>
              <TableCell className="font-semibold">Role</TableCell>
              <TableCell className="font-semibold">Location</TableCell>
              <TableCell className="font-semibold">Period</TableCell>
              <TableCell className="font-semibold">Status</TableCell>
              <TableCell align="right" className="font-semibold">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" className="py-8 text-gray-500">
                  No jobs stored in database yet. Built-in CloudVibe fallback is active on the public site.
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={job._id} hover>
                  <TableCell className="font-semibold">{job.company}</TableCell>
                  <TableCell>{job.role}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>
                    {job.startDate} — {job.isCurrent ? "Present" : job.endDate}
                  </TableCell>
                  <TableCell>
                    {job.isCurrent ? (
                      <Chip label="Current" color="success" size="small" />
                    ) : (
                      <Chip label="Past" size="small" />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/jobs/${job._id}`}>
                        <IconButton color="primary" size="small">
                          <FaEdit />
                        </IconButton>
                      </Link>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => setDeleteId(job._id)}
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
        title="Delete Job"
        description="Are you sure you want to delete this job entry?"
        confirmText="Delete Job"
        isDestructive={true}
      />
    </div>
  );
}

