import type { Vocabulary } from "@/app/generated/prisma/client";

export type FlashcardSessionMode = "latest" | "forgetTheMost";

export function isFlashcardSessionMode(
  value: unknown
): value is FlashcardSessionMode {
  return value === "latest" || value === "forgetTheMost";
}

export interface FlashcardSession {
  cards: Vocabulary[];
  index: number;
}

export type FlashcardGrade = "easy" | "hard";

export function isFlashcardGrade(value: unknown): value is FlashcardGrade {
  return value === "easy" || value === "hard";
}

const globalForFlashcardSessions = globalThis as unknown as {
  flashcardSessions?: Map<string, FlashcardSession>;
};

export const flashcardSessions =
  globalForFlashcardSessions.flashcardSessions ??
  new Map<string, FlashcardSession>();

if (process.env.NODE_ENV !== "production") {
  globalForFlashcardSessions.flashcardSessions = flashcardSessions;
}

export function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getCurrentCard(session: FlashcardSession): Vocabulary | undefined {
  return session.cards[session.index];
}

export function advanceFlashcardSession(
  session: FlashcardSession
): Vocabulary | undefined {
  session.index += 1;
  return getCurrentCard(session);
}
