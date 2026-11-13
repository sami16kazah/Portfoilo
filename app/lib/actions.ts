"use server";

import { headers } from "next/headers";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import {
  checkRateLimit,
  getClientIp,
  isSafeRelativeRedirect,
  normalizeEmail,
  peekRateLimitBlocked,
} from "@/lib/security";

const IP_LOGIN_LIMIT = 15;
const EMAIL_LOGIN_LIMIT = 5;
const WINDOW_MS = 15 * 60 * 1000;

export async function authenticate(
  _prevState: string | undefined,
  formData: FormData
) {
  const hdrs = await headers();
  const ip = getClientIp(hdrs);

  const ipCheck = checkRateLimit(`login:ip:${ip}`, IP_LOGIN_LIMIT, WINDOW_MS);
  if (!ipCheck.allowed) {
    return `Too many sign-in attempts. Please wait ${Math.ceil(ipCheck.retryAfterSeconds / 60)} minute(s) before trying again.`;
  }

  const rawEmail = String(formData.get("email") || "");
  if (rawEmail) {
    const emailCheck = peekRateLimitBlocked(
      `login:email:${normalizeEmail(rawEmail)}`,
      EMAIL_LOGIN_LIMIT
    );
    if (emailCheck.blocked) {
      return `Account temporarily locked due to repeated failed attempts. Try again in ${Math.ceil(emailCheck.retryAfterSeconds / 60)} minute(s).`;
    }
  }

  const rawCallbackUrl = String(formData.get("callbackUrl") || "");
  const safeRedirectTo =
    isSafeRelativeRedirect(rawCallbackUrl) &&
    rawCallbackUrl.startsWith("/admin") &&
    !rawCallbackUrl.startsWith("/admin/login")
      ? rawCallbackUrl
      : "/admin/dashboard";

  try {
    await signIn("credentials", {
      email: rawEmail,
      password: String(formData.get("password") || ""),
      redirectTo: safeRedirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid email or password.";
        default:
          return "Authentication failed. Please try again.";
      }
    }
    throw error;
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: "/admin/login" });
}
