import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import {
  flashcardSessions,
  isFlashcardSessionMode,
  shuffle,
} from "@/app/lib/flashcardSession";
import { requireUserId } from "@/app/lib/requireAuth";

export async function POST(req: NextRequest) {
  const authResult = await requireUserId();
  if ("unauthorized" in authResult) return authResult.unauthorized;
  const { userId } = authResult;

  const body = await req.json().catch(() => null);
  const mode: unknown = body?.mode;
  const count: unknown = body?.count;

  if (!isFlashcardSessionMode(mode)) {
    return NextResponse.json(
      { error: `Unsupported mode: ${String(mode)}` },
      { status: 400 }
    );
  }

  if (typeof count !== "number" || !Number.isInteger(count) || count < 1) {
    return NextResponse.json(
      { error: "count must be a positive integer" },
      { status: 400 }
    );
  }

  const orderBy =
    mode === "latest"
      ? [{ createdAt: "desc" as const }]
      : [{ hardCount: "desc" as const }, { createdAt: "desc" as const }];

  const cards = await prisma.vocabulary.findMany({
    where: { userId },
    orderBy,
    take: count,
  });

  if (cards.length === 0) {
    return NextResponse.json(
      { error: "No cards available" },
      { status: 400 }
    );
  }

  const sessionId = crypto.randomUUID();
  flashcardSessions.set(sessionId, { cards: shuffle(cards), index: 0, userId });

  return NextResponse.json({ sessionId }, { status: 201 });
}
