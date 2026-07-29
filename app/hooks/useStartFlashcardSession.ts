"use client";

import { useState } from "react";
import type { FlashcardSessionMode } from "@/app/lib/flashcardSession";

export function useStartFlashcardSession() {
  const [status, setStatus] = useState<"idle" | "starting">("idle");
  const [error, setError] = useState<string | null>(null);

  const start = async (mode: FlashcardSessionMode, count: number) => {
    setStatus("starting");
    setError(null);

    try {
      const res = await fetch("/api/flashcard/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, count }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Could not start session. Please try again.");
        setStatus("idle");
        return null;
      }

      setStatus("idle");
      return data.sessionId as string;
    } catch {
      setError("Network error. Please try again.");
      setStatus("idle");
      return null;
    }
  };

  const reset = () => {
    setStatus("idle");
    setError(null);
  };

  return { status, error, start, reset };
}
