import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Book } from "@/models/Book";
import { auth } from "@/auth";

export async function GET() {
  await connectToDatabase();
  const books = await Book.find().sort({ createdAt: -1 });
  return NextResponse.json(books);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectToDatabase();
  const body = await req.json();
  const newBook = await Book.create(body);
  return NextResponse.json(newBook, { status: 201 });
}
