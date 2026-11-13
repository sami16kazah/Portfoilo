"use client";

import { Suspense, useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { ArrowBack, LockOutlined } from "@mui/icons-material";
import { authenticate } from "@/app/lib/actions";

function LoginForm() {
  const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";
  const reason = searchParams.get("reason");

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={2}
      py={6}
      sx={{ backgroundColor: "#070B14" }}
    >
      <Container maxWidth="xs">
        <Card
          sx={{
            borderRadius: 4,
            backgroundColor: "#0D1322",
            border: "1px solid #1E293B",
            boxShadow: "0 24px 60px -15px rgba(0,0,0,0.7)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <img
                src="/assets/images/sami.jpg"
                alt="Sami Kazah"
                className="h-12 w-12 rounded-2xl object-cover object-top border border-emerald-500/40"
              />
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#34D399",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <LockOutlined sx={{ fontSize: 13 }} /> Protected Access
                </Typography>
                <Typography variant="h5" fontWeight={800} color="#F8FAFC">
                  Portfolio Studio
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary" mb={3}>
              Sign in with your administrator credentials to manage your live portfolio, cloud architecture profile, and books.
            </Typography>

            {reason === "session_expired" && !errorMessage && (
              <Alert severity="info" sx={{ mb: 2.5, borderRadius: 2 }}>
                Your previous session ended or was revoked. Please sign in again.
              </Alert>
            )}

            <form action={dispatch} className="space-y-4">
              <input type="hidden" name="callbackUrl" value={callbackUrl} />

              <TextField
                label="Admin Email"
                type="email"
                name="email"
                fullWidth
                required
                autoComplete="email"
                placeholder="you@example.com"
              />

              <TextField
                label="Password"
                type="password"
                name="password"
                fullWidth
                required
                autoComplete="current-password"
              />

              {errorMessage && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {errorMessage}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={isPending}
                sx={{ py: 1.4, fontSize: "0.95rem", fontWeight: 700 }}
              >
                {isPending ? "Verifying session..." : "Sign In to Studio"}
              </Button>
            </form>

            <Box mt={3} pt={2.5} borderTop="1px solid #1E293B" textAlign="center">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors"
              >
                <ArrowBack sx={{ fontSize: 15 }} /> Back to Live Portfolio
              </Link>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <Box
          minHeight="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ backgroundColor: "#070B14", color: "#94A3B8" }}
        >
          Loading sign-in portal...
        </Box>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
