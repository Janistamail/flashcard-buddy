import { NextRequest, NextResponse } from "next/server";
import {
  advanceFlashcardSession,
  getOwnedFlashcardSession,
} from "@/app/lib/flashcardSession";
import { requireUserId } from "@/app/lib/requireAuth";

export async function POST(
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

  const next = advanceFlashcardSession(session);

  return NextResponse.json({
    card: next
      ? { id: next.id, english: next.english, englishMeaning: next.englishMeaning }
      : null,
  });
}
