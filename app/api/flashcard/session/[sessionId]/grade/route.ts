import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import {
  flashcardSessions,
  getCurrentCard,
  isFlashcardGrade,
} from "@/app/lib/flashcardSession";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const session = flashcardSessions.get(sessionId);

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const current = getCurrentCard(session);

  if (!current) {
    return NextResponse.json(
      { error: "No more cards in session" },
      { status: 404 }
    );
  }

  const body = await req.json().catch(() => null);
  const grade: unknown = body?.grade;

  if (!isFlashcardGrade(grade)) {
    return NextResponse.json(
      { error: `Unsupported grade: ${String(grade)}` },
      { status: 400 }
    );
  }

  await prisma.vocabulary.update({
    where: { id: current.id },
    data:
      grade === "easy"
        ? { easyCount: { increment: 1 } }
        : { hardCount: { increment: 1 } },
  });

  return NextResponse.json({ success: true });
}
