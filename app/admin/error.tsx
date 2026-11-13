"use client";

import Link from "next/link";
import { Alert, Box, Button, Card, CardContent, Typography } from "@mui/material";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Box
      minHeight="70vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={3}
    >
      <Card sx={{ maxWidth: 460, width: "100%", borderRadius: 4 }}>
        <CardContent sx={{ p: 4 }} className="space-y-4">
          <Typography variant="h5" fontWeight={800} color="#F8FAFC">
            Studio Recovery
          </Typography>
          <Typography variant="body2" color="text.secondary">
            The admin panel encountered a temporary server or session mismatch while loading this page.
          </Typography>
          <Alert severity="warning" sx={{ borderRadius: 2 }}>
            {error.message || "Unexpected admin rendering error"}
          </Alert>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="contained" color="primary" onClick={reset}>
              Try Again
            </Button>
            <Button
              component={Link}
              href="/admin/login?reason=session_expired"
              variant="outlined"
              color="secondary"
            >
              Sign In Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </Box>
  );
}

