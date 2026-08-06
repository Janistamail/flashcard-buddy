"use client";

import { useEffect, useState } from "react";
import type { FlashcardGrade } from "@/app/lib/flashcardSession";

export type FlashcardCard = {
  id: string;
  english: string;
  englishMeaning: string;
};

export function useFlashcardPlay(sessionId: string | null) {
  const [card, setCard] = useState<FlashcardCard | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [counts, setCounts] = useState({ easy: 0, hard: 0 });

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
          setLoadError(e instanceof Error ? e.message : "Failed to load card");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const reveal = () => {
    if (card && !revealed) setRevealed(true);
  };

  const grade = async (value: FlashcardGrade) => {
    if (!sessionId || !card || !revealed || submitting) return false;

    setSubmitting(true);
    setActionError(null);

    try {
      const res = await fetch(`/api/flashcard/session/${sessionId}/grade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade: value }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setActionError(data?.error ?? "Could not save grade. Please try again.");
        return false;
      }

      setCounts((c) => ({
        ...c,
        [value]: c[value] + 1,
      }));
      return true;
    } catch {
      setActionError("Network error. Please try again.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const next = async () => {
    if (!sessionId || submitting) return;

    setSubmitting(true);
    setActionError(null);

    try {
      const res = await fetch(`/api/flashcard/session/${sessionId}/advance`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        setActionError(data.error ?? "Could not advance. Please try again.");
        return;
      }

      if (data.card) {
        setCard(data.card);
        setRevealed(false);
      } else {
        setComplete(true);
      }
    } catch {
      setActionError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const missingSession = !sessionId;
  const status: "loading" | "loaded" | "error" = missingSession
    ? "error"
    : loadError
      ? "error"
      : card || complete
        ? "loaded"
        : "loading";

  return {
    status,
    error: missingSession ? "Missing session" : loadError,
    card,
    revealed,
    reveal,
    complete,
    grade,
    next,
    submitting,
    actionError,
    counts,
  };
}
