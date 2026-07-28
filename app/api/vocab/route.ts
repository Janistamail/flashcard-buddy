import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import type { VocabularyInput } from "@/app/lib/vocab";

function trimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET() {
  const vocab = await prisma.vocabulary.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(vocab);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const english = trimmedString(body?.english);
  const thai = trimmedString(body?.thai);
  const englishMeaning = trimmedString(body?.englishMeaning);
  const examples = Array.isArray(body?.examples) ? body.examples : null;

  if (
    !english ||
    !thai ||
    !englishMeaning ||
    !examples ||
    !examples.every((ex: unknown) => typeof ex === "string")
  ) {
    return NextResponse.json(
      { error: "english, thai, englishMeaning, and examples are required" },
      { status: 400 }
    );
  }

  const input: VocabularyInput = { english, thai, englishMeaning, examples };

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
