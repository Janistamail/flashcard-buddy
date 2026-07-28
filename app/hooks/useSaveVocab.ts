"use client";

import { useState } from "react";
import type { VocabularyInput } from "@/app/lib/vocab";

export function useSaveVocab() {
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);
  const [duplicate, setDuplicate] = useState(false);

  const save = async (payload: VocabularyInput) => {
    setStatus("saving");
    setError(null);
    setDuplicate(false);

    try {
      const res = await fetch("/api/vocab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 409) {
        setDuplicate(true);
        setStatus("idle");
        return;
      }

      if (!res.ok) {
        setError("Save failed. Please try again.");
        setStatus("idle");
        return;
      }

      setStatus("saved");
    } catch {
      setError("Network error. Please try again.");
      setStatus("idle");
    }
  };

  const dismissDuplicate = () => setDuplicate(false);

  const reset = () => {
    setStatus("idle");
    setError(null);
    setDuplicate(false);
  };

  return { status, error, duplicate, save, dismissDuplicate, reset };
}
