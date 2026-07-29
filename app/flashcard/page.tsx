"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useFlashcardCard } from "@/app/hooks/useFlashcardCard";

function FlashcardSessionView() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  const { card, status, error } = useFlashcardCard(sessionId);

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 text-center font-sans dark:bg-black">
      {status === "loading" && (
        <p className="text-zinc-500 dark:text-zinc-400">Loading…</p>
      )}
      {status === "error" && (
        <p className="text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
      {status === "loaded" && card && (
        <p className="text-2xl font-medium text-zinc-900 dark:text-zinc-50">
          {card.englishMeaning}
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
