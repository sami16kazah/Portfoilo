import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Photo } from "@/models/Photo";
import { auth } from "@/auth";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const { id } = await params;
    
    const deleted = await Photo.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    
    return NextResponse.json({ message: "Photo deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 });
  }
}
