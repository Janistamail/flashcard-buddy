import { NextRequest, NextResponse } from "next/server";
import { getCurrentCard, getOwnedFlashcardSession } from "@/app/lib/flashcardSession";
import { requireUserId } from "@/app/lib/requireAuth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const authResult = await requireUserId();
  if ("unauthorized" in authResult) return authResult.unauthorized;
  const { userId } = authResult;

  const { sessionId } = await params;
  const session = getOwnedFlashcardSession(sessionId, userId);

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
