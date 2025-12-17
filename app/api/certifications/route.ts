import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Certification } from "@/models/Certification";
import { auth } from "@/auth";
export async function GET() {
  await connectToDatabase();
  const certifications = await Certification.find().sort({ date: -1 });
  return NextResponse.json(certifications);
}
export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectToDatabase();
  const body = await request.json();
  const certification = await Certification.create(body);
  return NextResponse.json(certification);
}
