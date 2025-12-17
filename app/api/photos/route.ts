import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Photo } from "@/models/Photo";
import { auth } from "@/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const photos = await Photo.find().sort({ createdAt: -1 });
    return NextResponse.json(photos);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const body = await req.json();
    const newPhoto = await Photo.create(body);
    
    return NextResponse.json(newPhoto, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add photo" }, { status: 500 });
  }
}
