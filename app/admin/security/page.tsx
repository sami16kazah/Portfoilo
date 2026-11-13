"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import {
  FaCheckCircle,
  FaEnvelope,
  FaExclamationTriangle,
  FaKey,
  FaShieldAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { signOutAction } from "@/app/lib/actions";

interface SecurityState {
  email: string;
  role: string;
  sessionVersion: number;
  lastPasswordChangeAt: string | null;
  setupLocked: boolean;
  diagnostics: {
    hasAuthSecret: boolean;
    cloudinarySecretNonPublic: boolean;
    cloudinarySecretLegacyPublic: boolean;
    hasDatabaseUri: boolean;
    hasSetupToken: boolean;
    hasMailjet: boolean;
    isProduction: boolean;
  };
}

export default function AdminSecurityPage() {
  const router = useRouter();
  const [state, setState] = useState<SecurityState | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentPasswordForPw, setCurrentPasswordForPw] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  useEffect(() => {
    fetch("/api/admin/security", { cache: "no-store" })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          router.push("/admin/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && !data.error) {
          setState(data);
          setNewEmail(data.email || "");
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [router]);

  const submitSecurityAction = async (payload: Record<string, unknown>, actionName: string) => {
    setBusyAction(actionName);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setFeedback({ type: "error", text: json.error || "Update failed." });
        return;
      }

      setFeedback({ type: "success", text: json.message });
      if (json.requiresReauth) {
        setTimeout(() => {
          signOutAction();
        }, 1200);
      }
    } catch {
      setFeedback({ type: "error", text: "Network error while applying security update." });
    } finally {
      setBusyAction(null);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setFeedback({ type: "error", text: "New passwords do not match." });
      return;
    }
    await submitSecurityAction(
      {
        action: "change_password",
        currentPassword: currentPasswordForPw,
        newPassword,
      },
      "password"
    );
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitSecurityAction(
      {
        action: "change_email",
        currentPassword: currentPasswordForEmail,
        newEmail,
      },
      "email"
    );
  };

  const handleRevokeAll = async () => {
    await submitSecurityAction({ action: "revoke_sessions" }, "revoke");
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Account & Security
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage administrator credentials, revoke active browser sessions, and review hardening status.
          </Typography>
        </div>
        {state && (
          <Chip
            icon={<FaShieldAlt />}
            label={`Session Generation v${state.sessionVersion}`}
            color="primary"
            variant="outlined"
          />
        )}
      </div>

      {feedback && <Alert severity={feedback.type}>{feedback.text}</Alert>}

      <Grid container spacing={3}>
        {/* Change Password */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card className="border border-slate-200 h-full">
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="flex items-center gap-2">
                  <FaKey className="text-slate-700" />
                  <Typography variant="h6" fontWeight="bold">
                    Change Password
                  </Typography>
                </div>
                <Typography variant="caption" color="text.secondary" display="block">
                  Minimum 10 characters with uppercase, lowercase, and at least one number. Updating revokes all existing sessions.
                </Typography>

                <TextField
                  fullWidth
                  type="password"
                  label="Current Password"
                  required
                  value={currentPasswordForPw}
                  onChange={(e) => setCurrentPasswordForPw(e.target.value)}
                />
                <TextField
                  fullWidth
                  type="password"
                  label="New Strong Password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                  fullWidth
                  type="password"
                  label="Confirm New Password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={busyAction !== null}
                  color="primary"
                >
                  {busyAction === "password" ? "Updating Password..." : "Update Password & Sign Out"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Change Email & Session Revocation */}
        <Grid size={{ xs: 12, md: 6 }}>
          <div className="space-y-6">
            <Card className="border border-slate-200">
              <CardContent>
                <form onSubmit={handleEmailChange} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-slate-700" />
                    <Typography variant="h6" fontWeight="bold">
                      Update Admin Email
                    </Typography>
                  </div>
                  <TextField
                    fullWidth
                    type="email"
                    label="Admin Email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    type="password"
                    label="Confirm Current Password"
                    required
                    value={currentPasswordForEmail}
                    onChange={(e) => setCurrentPasswordForEmail(e.target.value)}
                  />
                  <Button
                    type="submit"
                    variant="outlined"
                    fullWidth
                    disabled={busyAction !== null}
                  >
                    {busyAction === "email" ? "Updating Email..." : "Change Admin Email"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border border-red-200 bg-red-50/40">
              <CardContent className="space-y-3">
                <Typography variant="subtitle1" fontWeight="bold" color="error">
                  Emergency Session Revocation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Immediately invalidates every active dashboard login token across all browsers and devices (including this one).
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  startIcon={<FaSignOutAlt />}
                  disabled={busyAction !== null}
                  onClick={handleRevokeAll}
                >
                  {busyAction === "revoke" ? "Revoking..." : "Revoke All Active Sessions"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </Grid>
      </Grid>

      {/* Hardening Audit Summary */}
      {state && (
        <Card className="border border-slate-200">
          <CardContent className="space-y-3">
            <Typography variant="h6" fontWeight="bold">
              Environment & Platform Security Audit
            </Typography>
            <Divider />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm pt-1">
              <AuditRow
                ok={state.setupLocked}
                title="Setup Route Lock (/setup & POST /api/setup)"
                detail={
                  state.setupLocked
                    ? "Locked permanently — admin user exists."
                    : "Not locked yet."
                }
              />
              <AuditRow
                ok={state.diagnostics.hasAuthSecret}
                title="Auth Signing Secret (AUTH_SECRET)"
                detail={
                  state.diagnostics.hasAuthSecret
                    ? "Configured in environment."
                    : "Set AUTH_SECRET in Vercel environment variables."
                }
              />
              <AuditRow
                ok={state.diagnostics.cloudinarySecretNonPublic}
                title="Cloudinary API Secret Scope"
                detail={
                  state.diagnostics.cloudinarySecretNonPublic
                    ? "Stored in server-only CLOUDINARY_API_SECRET."
                    : state.diagnostics.cloudinarySecretLegacyPublic
                    ? "Using NEXT_PUBLIC_CLOUDINARY_API_SECRET — add non-public CLOUDINARY_API_SECRET in Vercel and remove the NEXT_PUBLIC_ variable."
                    : "Cloudinary secret not configured."
                }
              />
              <AuditRow
                ok
                title="HTTP Headers, Rate Limiting & Payload Guards"
                detail="X-Frame-Options DENY, nosniff, no-store on /admin, login throttling (5 fails / 15m), URL & $ operator stripping."
              />
            </div>
            {state.lastPasswordChangeAt && (
              <Typography variant="caption" color="text.secondary" display="block">
                Last password update: {new Date(state.lastPasswordChangeAt).toLocaleString()}
              </Typography>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function AuditRow({ ok, title, detail }: { ok: boolean; title: string; detail: string }) {
  return (
    <div
      className={`p-3 rounded-xl border flex items-start gap-2.5 ${
        ok ? "bg-emerald-950/40 border-emerald-500/30" : "bg-amber-950/40 border-amber-500/30"
      }`}
    >
      {ok ? (
        <FaCheckCircle className="text-emerald-600 mt-0.5 shrink-0" />
      ) : (
        <FaExclamationTriangle className="text-amber-600 mt-0.5 shrink-0" />
      )}
      <div>
        <div className="font-semibold text-slate-900 text-xs">{title}</div>
        <div className="text-xs text-slate-600 mt-0.5">{detail}</div>
      </div>
    </div>
  );
}

