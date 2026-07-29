import { NextRequest, NextResponse } from "next/server";
import { flashcardSessions, getCurrentCard } from "@/app/lib/flashcardSession";

export async function GET(
  _req: NextRequest,
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

  return NextResponse.json({
    card: {
      id: current.id,
      english: current.english,
      englishMeaning: current.englishMeaning,
    },
  });
}
