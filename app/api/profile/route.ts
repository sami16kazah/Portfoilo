import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { PersonalInfo } from "@/models/PersonalInfo";
import { auth } from "@/auth";

export async function GET() {
  try {
    await connectToDatabase();
    // Assuming single-user profile for now, or fetch the first one
    const info = await PersonalInfo.findOne();
    if (!info) {
      return NextResponse.json({ 
        name: "", title: "", bio: [], email: "", phone: "", 
        socialLinks: { github: "", linkedin: "", twitter: "", instagram: "" },
        cvUrl: "", avatarUrl: ""
      }); 
    }
    return NextResponse.json(info);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const body = await req.json();
    
    // Upsert: update if exists, insert if not
    // We use findOneAndUpdate with upsert: true. 
    // Since we only have one profile, we can use an empty filter {} if we ensure only one exists, 
    // but better to manage via ID if we had it. Here we just take the first one.
    
    // First, check if one exists
    let info = await PersonalInfo.findOne();
    
    if (info) {
       info = await PersonalInfo.findByIdAndUpdate(info._id, body, { new: true });
    } else {
       info = await PersonalInfo.create(body);
    }
    
    return NextResponse.json(info);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
