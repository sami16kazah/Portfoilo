"use client";

import { useState, useEffect } from "react";
import { 
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Avatar
} from "@mui/material";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Link from "next/link";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

interface Book {
  _id: string;
  title: string;
  coverUrl: string;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/books");
      if (res.ok) setBooks(await res.json());
    } catch (error) {
      console.error("Failed to fetch books", error);
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
      const res = await fetch(`/api/books/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setBooks(books.filter(b => b._id !== deleteId));
    } catch (error) {
      console.error("Failed to delete", error);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h4" fontWeight="bold">Books & Publications</Typography>
        <Button 
          component={Link} 
          href="/admin/books/new" 
          variant="contained" 
          startIcon={<FaPlus />}
          className="bg-black hover:bg-gray-800"
        >
          Add Book
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cover</TableCell>
              <TableCell>Title</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book._id}>
                <TableCell>
                  <Avatar src={book.coverUrl} variant="square" />
                </TableCell>
                <TableCell>{book.title}</TableCell>
                <TableCell align="right">
                  <IconButton component={Link} href={`/admin/books/${book._id}`} color="primary">
                    <FaEdit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(book._id)} color="error">
                    <FaTrash />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {books.length === 0 && !loading && (
               <TableRow><TableCell colSpan={3} align="center">No books found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Book"
        description="Are you sure you want to delete this book?"
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
}
