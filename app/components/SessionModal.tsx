"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ModalShell from "@/app/components/ModalShell";
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
    <ModalShell open onClose={onClose}>
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Start a flashcard session
      </h2>

      <fieldset className="flex flex-col gap-2">
        <legend className="sr-only">Card selection</legend>
        <label className="flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
          <input
            type="radio"
            name="session-mode"
            value="latest"
            checked={mode === "latest"}
            onChange={() => setMode("latest")}
          />
          Latest
        </label>
        <label className="flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
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

      <label className="flex flex-col gap-1 text-sm text-zinc-900 dark:text-zinc-50">
        Number of cards
        <input
          type="number"
          min={1}
          value={count}
          onChange={(e) => setCount(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
      </label>

      {noCards && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No cards available yet
        </p>
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className=" self-center rounded-lg bg-zinc-900 px-4 py-1.5 font-medium text-white disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 w-30"
      >
        {status === "starting" ? "Starting…" : "OK"}
      </button>
    </ModalShell>
  );
}
