"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
    <Dialog open={open} onOpenChange={(next) => !next && handleClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Bulk Import</DialogTitle>
        </DialogHeader>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={status === "saving"}
          rows={10}
          placeholder='[{"english": "run", "thai": "...", "englishMeaning": "...", "examples": ["...", "..."]}]'
          className="w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-ring disabled:opacity-50"
        />

        {parseError && (
          <p className="text-sm text-destructive" role="alert">
            {parseError}
          </p>
        )}

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        {result && (
          <div className="flex flex-col gap-1 rounded-lg border border-border bg-muted p-3 text-sm">
            <p className="text-foreground">{result.savedCount} added</p>
            {result.duplicates.length > 0 && (
              <p className="text-muted-foreground">
                Duplicates skipped: {result.duplicates.join(", ")}
              </p>
            )}
            {result.invalid.length > 0 && (
              <p className="text-muted-foreground">
                Invalid entries skipped:{" "}
                {result.invalid
                  .map((item) => `#${item.index} (${item.reason})`)
                  .join(", ")}
              </p>
            )}
          </div>
        )}

        <DialogFooter>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
