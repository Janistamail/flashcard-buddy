"use client";

import { useEffect, useState } from "react";

export type FlashcardCard = {
  id: string;
  english: string;
  englishMeaning: string;
};

export function useFlashcardCard(sessionId: string | null) {
  const [card, setCard] = useState<FlashcardCard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;

    fetch(`/api/flashcard/session/${sessionId}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to load card");
        if (!cancelled) setCard(data.card);
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load card");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const missingSession = !sessionId;
  const status: "loading" | "loaded" | "error" = missingSession
    ? "error"
    : error
      ? "error"
      : card
        ? "loaded"
        : "loading";

  return {
    card,
    status,
    error: missingSession ? "Missing session" : error,
  };
}
