"use client";

import { useState } from "react";
import ModalShell from "@/app/components/ModalShell";
import { Button } from "@/components/ui/button";
import { useBulkImportVocab } from "@/app/hooks/useBulkImportVocab";

interface BulkImportModalProps {
  open: boolean;
  onClose: () => void;
}

export default function BulkImportModal({ open, onClose }: BulkImportModalProps) {
  const [text, setText] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const { status, error, result, importVocab, reset } = useBulkImportVocab();

  const handleClose = () => {
    setText("");
    setParseError(null);
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    setParseError(null);

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      setParseError("Invalid JSON.");
      return;
    }

    if (!Array.isArray(parsed)) {
      setParseError("Expected a JSON array of vocab objects.");
      return;
    }

    await importVocab(parsed);
  };

  return (
    <ModalShell open={open} onClose={handleClose}>
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Bulk Import
      </h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={status === "saving"}
        rows={10}
        placeholder='[{"english": "run", "thai": "...", "englishMeaning": "...", "examples": ["...", "..."]}]'
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-zinc-900 outline-none focus:border-zinc-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
      />

      {parseError && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {parseError}
        </p>
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}

      {result && (
        <div className="flex flex-col gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-zinc-900 dark:text-zinc-50">
            {result.savedCount} added
          </p>
          {result.duplicates.length > 0 && (
            <p className="text-zinc-600 dark:text-zinc-400">
              Duplicates skipped: {result.duplicates.join(", ")}
            </p>
          )}
          {result.invalid.length > 0 && (
            <p className="text-zinc-600 dark:text-zinc-400">
              Invalid entries skipped:{" "}
              {result.invalid
                .map((item) => `#${item.index} (${item.reason})`)
                .join(", ")}
            </p>
          )}
        </div>
      )}

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="ghost" onClick={handleClose}>
          Close
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={status === "saving" || !text.trim()}
        >
          {status === "saving" ? "Adding…" : "Add"}
        </Button>
      </div>
    </ModalShell>
  );
}
