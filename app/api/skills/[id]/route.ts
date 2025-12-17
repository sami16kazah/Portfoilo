import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Skill } from "@/models/Skill";
import { auth } from "@/auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const skill = await Skill.findById(id);
    if (!skill) return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    return NextResponse.json(skill);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch skill" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const updatedSkill = await Skill.findByIdAndUpdate(id, body, { new: true });
    
    if (!updatedSkill) return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    return NextResponse.json(updatedSkill);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const { id } = await params;
    const deletedSkill = await Skill.findByIdAndDelete(id);
    
    if (!deletedSkill) return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    return NextResponse.json({ message: "Skill deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
