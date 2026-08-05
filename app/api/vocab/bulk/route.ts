import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { parseVocabularyInput, type VocabularyInput } from "@/app/lib/vocab";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const items: unknown[] | null = Array.isArray(body?.items)
    ? body.items
    : null;

  if (!items) {
    return NextResponse.json(
      { error: "items must be an array" },
      { status: 400 }
    );
  }

  const existing = await prisma.vocabulary.findMany({
    select: { english: true },
  });
  const seen = new Set(existing.map((v) => v.english.toLowerCase()));

  const toCreate: VocabularyInput[] = [];
  const duplicates: string[] = [];
  const invalid: { index: number; reason: string }[] = [];

  items.forEach((item, index) => {
    const input = parseVocabularyInput(item);
    if (!input) {
      invalid.push({ index, reason: "missing or invalid fields" });
      return;
    }

    const key = input.english.toLowerCase();
    if (seen.has(key)) {
      duplicates.push(input.english);
      return;
    }

    seen.add(key);
    toCreate.push(input);
  });

  if (toCreate.length > 0) {
    await prisma.vocabulary.createMany({ data: toCreate });
  }

  return NextResponse.json({
    savedCount: toCreate.length,
    duplicates,
    invalid,
  });
}
