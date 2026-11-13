"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { ShieldOutlined } from "@mui/icons-material";

export default function SetupPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [requiresSetupToken, setRequiresSetupToken] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [setupToken, setSetupToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch("/api/setup");
        if (res.ok) {
          const data = await res.json();
          setInitialized(Boolean(data.initialized));
          setRequiresSetupToken(Boolean(data.requiresSetupToken));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setChecking(false);
      }
    };
    checkStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          ...(requiresSetupToken ? { setupToken } : {}),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create admin account.");
      } else {
        setSuccess("Administrator account created cleanly! Redirecting to login...");
        setTimeout(() => router.push("/admin/login"), 1200);
      }
    } catch {
      setError("Network error while creating admin account.");
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" px={2} py={6}>
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
            <Box display="flex" alignItems="center" gap={1.5} mb={2}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2.5,
                  backgroundColor: "rgba(16, 185, 129, 0.14)",
                  border: "1px solid rgba(16, 185, 129, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#34D399",
                }}
              >
                <ShieldOutlined />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#34D399", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  One-Time Initialization
                </Typography>
                <Typography variant="h5" fontWeight={800} color="#F8FAFC">
                  Admin Setup
                </Typography>
              </Box>
            </Box>

            {initialized ? (
              <Box space-y={3}>
                <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                  Administrator setup is already complete and locked for security.
                </Alert>
                <Link href="/admin/login" className="block">
                  <Button variant="contained" fullWidth size="large">
                    Go to Admin Login
                  </Button>
                </Link>
              </Box>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Create the primary administrator account using a strong password (min 10 chars, mixed case, number, symbol).
                </Typography>

                <TextField
                  label="Admin Email"
                  type="email"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                  label="Strong Password"
                  type="password"
                  fullWidth
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {requiresSetupToken && (
                  <TextField
                    label="Setup Authorization Token"
                    type="password"
                    fullWidth
                    required
                    value={setupToken}
                    onChange={(e) => setSetupToken(e.target.value)}
                    helperText="Configured via ADMIN_SETUP_TOKEN environment variable"
                  />
                )}

                {error && (
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert severity="success" sx={{ borderRadius: 2 }}>
                    {success}
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={submitting}
                  sx={{ py: 1.4, fontWeight: 700 }}
                >
                  {submitting ? "Initializing..." : "Create Admin Account"}
                </Button>
              </form>
            )}

            <Box mt={3} pt={2} borderTop="1px solid #1E293B" textAlign="center">
              <Link href="/" className="text-xs font-semibold text-slate-400 hover:text-cyan-300">
                ← Back to Public Portfolio
              </Link>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
