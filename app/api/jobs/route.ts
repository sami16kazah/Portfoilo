import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Job } from "@/models/Job";
import { auth } from "@/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const jobs = await Job.find().sort({ isCurrent: -1, order: 1, createdAt: -1 });
    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const body = await req.json();
    const newJob = await Job.create(body);
    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error("Failed to create job:", error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}

