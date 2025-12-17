import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Skill } from "@/models/Skill";
import { auth } from "@/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const skills = await Skill.find().sort({ proficiency: -1 });
    return NextResponse.json(skills);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const body = await req.json();
    const newSkill = await Skill.create(body);
    
    return NextResponse.json(newSkill, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}
