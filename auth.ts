import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";
import { authConfig } from "./auth.config";
import {
  checkRateLimit,
  normalizeEmail,
  peekRateLimitBlocked,
  resetRateLimit,
} from "@/lib/security";

const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

async function getUserByEmail(email: string) {
  await connectToDatabase();
  return User.findOne({ email: normalizeEmail(email) }).lean<{
    _id: unknown;
    email: string;
    password: string;
    role?: string;
    sessionVersion?: number;
  } | null>();
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email().max(200), password: z.string().min(6).max(128) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const email = normalizeEmail(parsedCredentials.data.email);
        const emailLimitKey = `login:email:${email}`;
        const blockedState = peekRateLimitBlocked(emailLimitKey, LOGIN_MAX_ATTEMPTS);
        if (blockedState.blocked) {
          console.warn(`Rate-limited login attempt for ${email}`);
          return null;
        }

        try {
          const user = await getUserByEmail(email);
          if (!user) {
            checkRateLimit(emailLimitKey, LOGIN_MAX_ATTEMPTS, LOGIN_WINDOW_MS);
            return null;
          }

          const passwordsMatch = await bcrypt.compare(
            parsedCredentials.data.password,
            user.password
          );
          if (!passwordsMatch) {
            checkRateLimit(emailLimitKey, LOGIN_MAX_ATTEMPTS, LOGIN_WINDOW_MS);
            return null;
          }

          resetRateLimit(emailLimitKey);
          return {
            id: String(user._id),
            email: user.email,
            role: user.role || "admin",
            sessionVersion: user.sessionVersion ?? 0,
          };
        } catch (error) {
          console.error("Credentials authorization error:", error);
          return null;
        }
      },
    }),
  ],
});
