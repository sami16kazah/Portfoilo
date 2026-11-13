"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from "@mui/material";

export default function SetupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [setupToken, setSetupToken] = useState("");
  const [initialized, setInitialized] = useState<boolean | null>(null);
  const [requiresSetupToken, setRequiresSetupToken] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/setup")
      .then((res) => res.json())
      .then((data) => {
        setInitialized(Boolean(data.initialized));
        setRequiresSetupToken(Boolean(data.requiresSetupToken));
      })
      .catch(() => setInitialized(true));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
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
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push("/admin/login");
    } catch {
      setError("Failed to connect to server");
      setLoading(false);
    }
  };

  if (initialized === null) {
    return (
      <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (initialized) {
    return (
      <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Card sx={{ width: "100%", p: 3 }}>
          <CardContent className="space-y-4 text-center">
            <Typography variant="h5" component="h1" fontWeight="bold">
              Setup Locked
            </Typography>
            <Alert severity="info">
              An administrator account already exists. Initial setup is permanently disabled for security.
            </Alert>
            <Button component={Link} href="/admin/login" variant="contained" fullWidth>
              Go to Admin Login
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", py: 4 }}>
      <Card sx={{ width: "100%", p: 2 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
            Portfolio Setup
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Create your admin account. Once created, this setup page locks permanently.
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Admin Email"
                type="email"
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Strong Password"
                type="password"
                required
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                helperText="Minimum 10 characters with uppercase, lowercase, and at least one digit."
              />
              <TextField
                label="Confirm Password"
                type="password"
                required
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {requiresSetupToken && (
                <TextField
                  label="Setup Authorization Token"
                  type="password"
                  required
                  fullWidth
                  value={setupToken}
                  onChange={(e) => setSetupToken(e.target.value)}
                />
              )}
              {error && <Alert severity="error">{error}</Alert>}
              <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>
                {loading ? "Creating Admin..." : "Create Admin"}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
