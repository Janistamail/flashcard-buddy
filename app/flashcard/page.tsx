"use client";

import { Suspense, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useFlashcardPlay } from "@/app/hooks/useFlashcardPlay";
import VictoryCelebration from "@/app/components/VictoryCelebration";
import FlashcardCard, {
  type FlashcardCardHandle,
} from "@/app/components/FlashcardCard";
import { Button } from "@/components/ui/button";
import type { FlashcardGrade } from "@/app/lib/flashcardSession";

function FlashcardSessionView() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  const {
    status,
    error,
    card,
    revealed,
    reveal,
    complete,
    grade,
    next,
    submitting,
    actionError,
    counts,
  } = useFlashcardPlay(sessionId);

  const cardRef = useRef<FlashcardCardHandle>(null);

  const handleDecide = async (value: FlashcardGrade) => {
    const graded = await grade(value);
    if (graded) await next();
  };

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
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {counts.easy} easy · {counts.hard} hard
        </p>
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  if (!card) return null;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 bg-zinc-50 px-6 py-10 text-center font-sans dark:bg-black">
      <div className="flex items-center gap-3 text-sm font-semibold">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
          Easy {counts.easy}
        </span>
        <span className="rounded-full bg-rose-100 px-3 py-1 text-rose-700 dark:bg-rose-950 dark:text-rose-400">
          Hard {counts.hard}
        </span>
      </div>

      <FlashcardCard
        ref={cardRef}
        card={card}
        revealed={revealed}
        busy={submitting}
        onReveal={reveal}
        onDecide={handleDecide}
      />

      {revealed ? (
        <div className="flex gap-3">
          <Button
            type="button"
            variant="ghost"
            className="hover:scale-110 hover:bg-transparent dark:hover:bg-transparent"
            onClick={() => cardRef.current?.swipe("hard")}
            disabled={submitting}
            aria-label="Hard"
          >
            <Image
              src="/lunla_thums_up.png"
              alt="Hard"
              width={50}
              height={50}
            />
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="hover:scale-110 hover:bg-transparent dark:hover:bg-transparent"
            onClick={() => cardRef.current?.swipe("easy")}
            disabled={submitting}
            aria-label="Easy"
          >
            <Image
              src="/lunla_thums_down.png"
              alt="Easy"
              width={50}
              height={50}
            />
          </Button>
        </div>
      ) : (
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          Tap the card to reveal the answer
        </p>
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
