import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/app/lib/prisma";
import { parseVocabularyInput } from "@/app/lib/vocab";
import { requireUserId } from "@/app/lib/requireAuth";

function duplicateResponse() {
  return NextResponse.json(
    { error: "duplicate", message: "This vocab already exists" },
    { status: 409 }
  );
}

export async function GET() {
  const authResult = await requireUserId();
  if ("unauthorized" in authResult) return authResult.unauthorized;
  const { userId } = authResult;

  const vocab = await prisma.vocabulary.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(vocab);
}

export async function POST(req: NextRequest) {
  const authResult = await requireUserId();
  if ("unauthorized" in authResult) return authResult.unauthorized;
  const { userId } = authResult;

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
  // below for the actual guarantee. Scoped to the caller's own vocab:
  // different users are allowed to save the same word.
  const existing = await prisma.vocabulary.findFirst({
    where: {
      userId,
      english: { equals: input.english, mode: "insensitive" },
    },
  });

  if (existing) {
    return duplicateResponse();
  }

  try {
    const vocabulary = await prisma.vocabulary.create({
      data: { ...input, userId },
    });
    return NextResponse.json(vocabulary, { status: 201 });
  } catch (e) {
    // Closes the race between the findFirst check above and this insert:
    // two overlapping requests can both pass the check, but only one can
    // win the DB's case-insensitive unique index (see migration
    // vocabulary_unique_english_ci_per_user).
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return duplicateResponse();
    }
    throw e;
  }
}
