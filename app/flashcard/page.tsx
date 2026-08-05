"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useFlashcardPlay } from "@/app/hooks/useFlashcardPlay";
import VictoryCelebration from "@/app/components/VictoryCelebration";

function FlashcardSessionView() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  const {
    status,
    error,
    card,
    revealed,
    complete,
    grade,
    grading,
    next,
    advancing,
    actionError,
  } = useFlashcardPlay(sessionId);

  if (status === "loading") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 text-center font-sans dark:bg-black">
        <p className="text-zinc-500 dark:text-zinc-400">Loading…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 text-center font-sans dark:bg-black">
        <p className="text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      </div>
    );
  }

  if (complete) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 px-6 text-center font-sans dark:bg-black">
        <VictoryCelebration />
        <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Session complete
        </p>
        <Link
          href="/"
          className="rounded-lg bg-zinc-900 px-5 py-2 font-medium text-white dark:bg-zinc-50 dark:text-zinc-900"
        >
          Back to home
        </Link>
      </div>
    );
  }

  if (!card) return null;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 px-6 text-center font-sans dark:bg-black">
      <p className="text-2xl font-medium text-zinc-900 dark:text-zinc-50">
        {card.englishMeaning}
      </p>

      {!revealed && (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => grade("easy")}
            disabled={grading}
            className="rounded-lg bg-zinc-900 px-5 py-2 font-medium text-white disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
          >
            Easy
          </button>
          <button
            type="button"
            onClick={() => grade("hard")}
            disabled={grading}
            className="rounded-lg border border-zinc-300 px-5 py-2 font-medium text-zinc-900 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-50"
          >
            Hard
          </button>
        </div>
      )}

      {revealed && (
        <>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">
            {card.english}
          </p>
          <button
            type="button"
            onClick={next}
            disabled={advancing}
            className="rounded-lg bg-zinc-900 px-5 py-2 font-medium text-white disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
          >
            Next
          </button>
        </>
      )}

      {actionError && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {actionError}
        </p>
      )}
    </div>
  );
}

export default function FlashcardPage() {
  return (
    <Suspense fallback={null}>
      <FlashcardSessionView />
    </Suspense>
  );
}
