import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Education } from "@/models/Education";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  const edu = await Education.findById(id);
  if (!edu) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(edu);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  const body = await request.json();
  const updated = await Education.findByIdAndUpdate(id, body, { new: true });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  await Education.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted" });
}
