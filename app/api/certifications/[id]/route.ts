import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Certification } from "@/models/Certification";
import { auth } from "@/auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const certification = await Certification.findById(id);
    if (!certification) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(certification);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch certification" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const updated = await Certification.findByIdAndUpdate(id, body, { new: true });
    
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update certification" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const { id } = await params;
    const deleted = await Certification.findByIdAndDelete(id);
    
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete certification" }, { status: 500 });
  }
}
