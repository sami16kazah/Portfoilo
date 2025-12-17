"use client";

import { useActionState } from "react";
import { authenticate } from "@/app/lib/actions";
import { Box, Button, Container, TextField, Typography, Card, CardContent } from "@mui/material";

export default function LoginPage() {
  const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined);

  return (
    <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Card sx={{ width: "100%", p: 2 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Admin Login
          </Typography>
          <form action={dispatch}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Email"
                name="email"
                type="email"
                required
                fullWidth
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                required
                fullWidth
              />
              {errorMessage && (
                <Typography color="error" variant="body2">
                  {errorMessage}
                </Typography>
              )}
              <Button 
                type="submit" 
                variant="contained" 
                size="large" 
                fullWidth 
                disabled={isPending}
              >
                {isPending ? "Signing in..." : "Sign In"}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
