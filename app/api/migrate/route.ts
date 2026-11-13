import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Project } from "@/models/Project";
import { Skill } from "@/models/Skill";
import { PersonalInfo } from "@/models/PersonalInfo";
import { Book } from "@/models/Book";
import { Education } from "@/models/Education";
import { Job } from "@/models/Job";
import { auth } from "@/auth";
import {
  DEFAULT_BOOKS,
  DEFAULT_EDUCATION,
  DEFAULT_JOBS,
  DEFAULT_PROFILE,
  DEFAULT_PROJECTS,
  DEFAULT_SKILLS,
} from "@/data/portfolioDefaults";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const existingInfo = await PersonalInfo.findOne();
    if (!existingInfo) {
      await PersonalInfo.create(DEFAULT_PROFILE);
    }

    if ((await Job.countDocuments()) === 0) {
      await Job.insertMany(DEFAULT_JOBS);
    }

    if ((await Skill.countDocuments()) === 0) {
      await Skill.insertMany(DEFAULT_SKILLS);
    }

    if ((await Project.countDocuments()) === 0) {
      await Project.insertMany(DEFAULT_PROJECTS);
    }

    if ((await Education.countDocuments()) === 0) {
      await Education.insertMany(DEFAULT_EDUCATION);
    }

    if ((await Book.countDocuments()) === 0) {
      await Book.insertMany(DEFAULT_BOOKS);
    }

    return NextResponse.json({ message: "Migration completed successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Migration failed" }, { status: 500 });
  }
}
