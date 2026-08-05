"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useVocabCount } from "@/app/hooks/useVocabCount";
import { useStartFlashcardSession } from "@/app/hooks/useStartFlashcardSession";
import type { FlashcardSessionMode } from "@/app/lib/flashcardSession";

interface SessionModalProps {
  onClose: () => void;
}

function isValidCount(value: string): boolean {
  if (value.trim() === "") return false;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1;
}

export default function SessionModal({ onClose }: SessionModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<FlashcardSessionMode>("latest");
  const [count, setCount] = useState("10");
  const { count: cardsAvailable } = useVocabCount();
  const { status, error, start } = useStartFlashcardSession();

  const noCards = cardsAvailable === 0;
  const canSubmit =
    cardsAvailable !== null &&
    !noCards &&
    isValidCount(count) &&
    status !== "starting";

  const handleSubmit = async () => {
    if (!canSubmit) return;
    const sessionId = await start(mode, Number(count));
    if (sessionId) {
      onClose();
      router.push(`/flashcard?session=${sessionId}`);
    }
  };

  return (
    <Dialog open onOpenChange={(next) => !next && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a flashcard session</DialogTitle>
        </DialogHeader>

        <fieldset className="flex flex-col gap-2">
          <legend className="sr-only">Card selection</legend>
          <label className="flex items-center gap-2 text-foreground">
            <input
              type="radio"
              name="session-mode"
              value="latest"
              checked={mode === "latest"}
              onChange={() => setMode("latest")}
            />
            Latest
          </label>
          <label className="flex items-center gap-2 text-foreground">
            <input
              type="radio"
              name="session-mode"
              value="forgetTheMost"
              checked={mode === "forgetTheMost"}
              onChange={() => setMode("forgetTheMost")}
            />
            Forget the most
          </label>
        </fieldset>

        <label className="flex flex-col gap-1 text-sm text-foreground">
          Number of cards
          <input
            type="number"
            min={1}
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-1.5 text-foreground outline-none focus:border-ring"
          />
        </label>

        {noCards && (
          <p className="text-sm text-muted-foreground">
            No cards available yet
          </p>
        )}

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-30 self-center"
        >
          {status === "starting" ? "Starting…" : "OK"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
