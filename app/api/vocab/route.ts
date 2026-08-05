import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { parseVocabularyInput } from "@/app/lib/vocab";

export async function GET() {
  const vocab = await prisma.vocabulary.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(vocab);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const input = parseVocabularyInput(body);

  if (!input) {
    return NextResponse.json(
      { error: "english, thai, englishMeaning, and examples are required" },
      { status: 400 }
    );
  }

  const existing = await prisma.vocabulary.findFirst({
    where: { english: { equals: input.english, mode: "insensitive" } },
  });

  if (existing) {
    return NextResponse.json(
      { error: "duplicate", message: "This vocab already exists" },
      { status: 409 }
    );
  }

  const vocabulary = await prisma.vocabulary.create({ data: input });

  return NextResponse.json(vocabulary, { status: 201 });
}
