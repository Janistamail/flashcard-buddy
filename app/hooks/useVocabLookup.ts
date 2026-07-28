"use client";

import { useState } from "react";
import type { LeverMode } from "@/app/components/Lever";
import type { WordLookupResult } from "@/app/lib/vocab";

export function useVocabLookup() {
  const [result, setResult] = useState<WordLookupResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const lookup = async (mode: LeverMode, text: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/vocab/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Lookup failed. Please try again.");
        setResult(null);
        return;
      }

      setResult(data as WordLookupResult);
    } catch {
      setError("Network error. Please try again.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { result, error, loading, lookup, reset };
}
