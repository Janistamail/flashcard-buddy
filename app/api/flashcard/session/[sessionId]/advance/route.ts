import { NextRequest, NextResponse } from "next/server";
import {
  advanceFlashcardSession,
  flashcardSessions,
} from "@/app/lib/flashcardSession";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const session = flashcardSessions.get(sessionId);

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const next = advanceFlashcardSession(session);

  return NextResponse.json({
    card: next
      ? { id: next.id, english: next.english, englishMeaning: next.englishMeaning }
      : null,
  });
}
