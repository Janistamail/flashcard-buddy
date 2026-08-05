"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useFlashcardPlay } from "@/app/hooks/useFlashcardPlay";
import VictoryCelebration from "@/app/components/VictoryCelebration";
import { Button } from "@/components/ui/button";

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
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
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
          <Button type="button" 
            size='lg'
          onClick={() => grade("easy")} disabled={grading}>
            Easy
          </Button>
          <Button
            type="button"
            variant="outline"
            size='lg'
            onClick={() => grade("hard")}
            disabled={grading}
          >
            Hard
          </Button>
        </div>
      )}

      {revealed && (
        <>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">
            {card.english}
          </p>
          <Button type="button" onClick={next} disabled={advancing}>
            Next
          </Button>
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
