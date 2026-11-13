import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Job } from "@/models/Job";
import { auth } from "@/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const job = await Job.findById(id);
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
    return NextResponse.json(job);
  } catch (error) {
    console.error("Failed to fetch job:", error);
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const updatedJob = await Job.findByIdAndUpdate(id, body, { new: true });

    if (!updatedJob) return NextResponse.json({ error: "Job not found" }, { status: 404 });
    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error("Failed to update job:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const { id } = await params;
    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) return NextResponse.json({ error: "Job not found" }, { status: 404 });
    return NextResponse.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Failed to delete job:", error);
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}

