import crypto from "node:crypto";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";
import {
  checkRateLimit,
  getClientIp,
  normalizeEmail,
  validateStrongPassword,
} from "@/lib/security";

function timingSafeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function GET() {
  try {
    await connectToDatabase();
    const userCount = await User.countDocuments();
    return NextResponse.json({
      initialized: userCount > 0,
      requiresSetupToken: Boolean(process.env.ADMIN_SETUP_TOKEN),
    });
  } catch (error) {
    console.error("Setup status check failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`setup:${ip}`, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many setup attempts. Please wait and try again." },
        { status: 429 }
      );
    }

    await connectToDatabase();

    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return NextResponse.json(
        { error: "Setup already completed. Admin account already exists." },
        { status: 403 }
      );
    }

    const expectedToken = process.env.ADMIN_SETUP_TOKEN;
    const rawBody = await req.json();

    if (expectedToken) {
      const providedToken = String(rawBody?.setupToken ?? "");
      if (!providedToken || !timingSafeCompare(providedToken, expectedToken)) {
        return NextResponse.json(
          { error: "Invalid or missing setup authorization token." },
          { status: 403 }
        );
      }
    }

    const parsed = z
      .object({
        email: z.string().email("Please provide a valid email address.").max(200),
        password: z.string().min(10).max(128),
      })
      .safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Valid email and strong password (min 10 chars) are required." },
        { status: 400 }
      );
    }

    const passwordCheck = validateStrongPassword(parsed.data.password);
    if (!passwordCheck.valid) {
      return NextResponse.json({ error: passwordCheck.reason }, { status: 400 });
    }

    const normalizedEmail = normalizeEmail(parsed.data.email);
    const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

    const newUser = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      role: "admin",
      sessionVersion: 0,
      lastPasswordChangeAt: new Date(),
    });

    return NextResponse.json(
      {
        message: "Admin created successfully.",
        user: { email: newUser.email, role: newUser.role },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
