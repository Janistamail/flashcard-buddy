"use client";

import { useState } from "react";

export type BulkImportInvalidEntry = {
  index: number;
  reason: string;
};

export type BulkImportResult = {
  savedCount: number;
  duplicates: string[];
  invalid: BulkImportInvalidEntry[];
};

export function useBulkImportVocab() {
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BulkImportResult | null>(null);

  const importVocab = async (items: unknown[]) => {
    setStatus("saving");
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/vocab/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (!res.ok) {
        setError("Import failed. Please try again.");
        setStatus("idle");
        return;
      }

      const data: BulkImportResult = await res.json();
      setResult(data);
      setStatus("done");
    } catch {
      setError("Network error. Please try again.");
      setStatus("idle");
    }
  };

  const reset = () => {
    setStatus("idle");
    setError(null);
    setResult(null);
  };

  return { status, error, result, importVocab, reset };
}
