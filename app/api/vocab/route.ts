import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/app/lib/prisma";
import { parseVocabularyInput } from "@/app/lib/vocab";

function duplicateResponse() {
  return NextResponse.json(
    { error: "duplicate", message: "This vocab already exists" },
    { status: 409 }
  );
}

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

  // Fast path: cheap early-out for the common case, avoids a failed
  // insert round-trip. Not race-safe on its own — see the unique index
  // below for the actual guarantee.
  const existing = await prisma.vocabulary.findFirst({
    where: { english: { equals: input.english, mode: "insensitive" } },
  });

  if (existing) {
    return duplicateResponse();
  }

  try {
    const vocabulary = await prisma.vocabulary.create({ data: input });
    return NextResponse.json(vocabulary, { status: 201 });
  } catch (e) {
    // Closes the race between the findFirst check above and this insert:
    // two overlapping requests can both pass the check, but only one can
    // win the DB's case-insensitive unique index (see migration
    // vocabulary_unique_english_ci).
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return duplicateResponse();
    }
    throw e;
  }
}
