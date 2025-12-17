import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Education } from "@/models/Education";
import { auth } from "@/auth";

export async function GET() {
  await connectToDatabase();
  const edu = await Education.find().sort({ createdAt: -1 });
  return NextResponse.json(edu);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectToDatabase();
  const body = await req.json();
  const newEdu = await Education.create(body);
  return NextResponse.json(newEdu, { status: 201 });
}
