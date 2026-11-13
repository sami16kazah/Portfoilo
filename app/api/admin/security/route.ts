import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";
import { requireAdmin } from "@/lib/apiUtils";
import {
  getSecurityDiagnostics,
  normalizeEmail,
  validateStrongPassword,
} from "@/lib/security";

export async function GET() {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) return adminCheck.response;

  try {
    await connectToDatabase();
    const [user, userCount] = await Promise.all([
      User.findById(adminCheck.user.id)
        .select("email role sessionVersion lastPasswordChangeAt createdAt")
        .lean<{
          email: string;
          role: string;
          sessionVersion?: number;
          lastPasswordChangeAt?: Date;
          createdAt?: Date;
        } | null>(),
      User.countDocuments(),
    ]);

    return NextResponse.json({
      email: user?.email || adminCheck.user.email,
      role: user?.role || adminCheck.user.role,
      sessionVersion: user?.sessionVersion ?? 0,
      lastPasswordChangeAt: user?.lastPasswordChangeAt || user?.createdAt || null,
      setupLocked: userCount > 0,
      diagnostics: getSecurityDiagnostics(),
    });
  } catch (error) {
    console.error("Security info error:", error);
    return NextResponse.json({ error: "Failed to fetch security settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) return adminCheck.response;

  try {
    await connectToDatabase();
    const body = await req.json();
    const action = String(body?.action || "");

    const userDoc = await User.findById(adminCheck.user.id);
    if (!userDoc) {
      return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
    }

    if (action === "revoke_sessions") {
      await User.findByIdAndUpdate(userDoc._id, { $inc: { sessionVersion: 1 } });
      return NextResponse.json({
        message: "All active sessions have been revoked. Please sign in again.",
        requiresReauth: true,
      });
    }

    if (action === "change_password") {
      const parsed = z
        .object({
          currentPassword: z.string().min(1),
          newPassword: z.string().min(10).max(128),
        })
        .safeParse(body);

      if (!parsed.success) {
        return NextResponse.json(
          { error: "Current password and new strong password (min 10 chars) are required." },
          { status: 400 }
        );
      }

      const matches = await bcrypt.compare(parsed.data.currentPassword, userDoc.password);
      if (!matches) {
        return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
      }

      if (parsed.data.currentPassword === parsed.data.newPassword) {
        return NextResponse.json(
          { error: "New password must be different from your current password." },
          { status: 400 }
        );
      }

      const strength = validateStrongPassword(parsed.data.newPassword);
      if (!strength.valid) {
        return NextResponse.json({ error: strength.reason }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(parsed.data.newPassword, 12);
      await User.findByIdAndUpdate(userDoc._id, {
        $set: {
          password: hashedPassword,
          lastPasswordChangeAt: new Date(),
        },
        $inc: { sessionVersion: 1 },
      });

      return NextResponse.json({
        message: "Password updated and all active sessions revoked. Please sign in again.",
        requiresReauth: true,
      });
    }

    if (action === "change_email") {
      const parsed = z
        .object({
          currentPassword: z.string().min(1),
          newEmail: z.string().email().max(200),
        })
        .safeParse(body);

      if (!parsed.success) {
        return NextResponse.json(
          { error: "Current password and a valid new email address are required." },
          { status: 400 }
        );
      }

      const matches = await bcrypt.compare(parsed.data.currentPassword, userDoc.password);
      if (!matches) {
        return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
      }

      const normalized = normalizeEmail(parsed.data.newEmail);
      await User.findByIdAndUpdate(userDoc._id, {
        $set: { email: normalized },
        $inc: { sessionVersion: 1 },
      });

      return NextResponse.json({
        message: "Admin email updated and existing sessions revoked. Please sign in with your new email.",
        requiresReauth: true,
      });
    }

    return NextResponse.json({ error: "Unsupported security action." }, { status: 400 });
  } catch (error) {
    console.error("Security update error:", error);
    return NextResponse.json({ error: "Failed to apply security update" }, { status: 500 });
  }
}

