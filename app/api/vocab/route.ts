import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const vocab = await prisma.vocabulary.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(vocab);
}

export async function POST(req: NextRequest) {
  const { english, thai, notes } = await req.json();

  if (!english || !thai) {
    return NextResponse.json(
      { error: "english and thai are required" },
      { status: 400 }
    );
  }

  const entry = await prisma.vocabulary.create({
    data: { english, thai, notes },
  });

  return NextResponse.json(entry, { status: 201 });
}
