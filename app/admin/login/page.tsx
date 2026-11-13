"use client";

import { Suspense, useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import { authenticate } from "@/app/lib/actions";

function LoginFormContent() {
  const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "";

  return (
    <form action={dispatch}>
      {callbackUrl && <input type="hidden" name="callbackUrl" value={callbackUrl} />}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          fullWidth
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          fullWidth
        />
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={isPending}
          sx={{ bgcolor: "black", "&:hover": { bgcolor: "#222" } }}
        >
          {isPending ? "Signing in..." : "Sign In"}
        </Button>
      </Box>
    </form>
  );
}

export default function LoginPage() {
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Card sx={{ width: "100%", p: 2 }}>
        <CardContent className="space-y-4">
          <div className="text-center space-y-1">
            <Typography variant="h4" component="h1" fontWeight="bold">
              Portfolio Studio
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in with your administrator credentials
            </Typography>
          </div>

          <Suspense fallback={<Typography align="center">Loading...</Typography>}>
            <LoginFormContent />
          </Suspense>

          <div className="pt-2 text-center">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-800 underline">
              Back to public portfolio
            </Link>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
