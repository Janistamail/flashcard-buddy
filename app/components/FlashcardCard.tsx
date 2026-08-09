"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Turtle, Volume2 } from "lucide-react";
import type { FlashcardGrade } from "@/app/lib/flashcardSession";
import type { FlashcardCard as FlashcardType } from "@/app/hooks/useFlashcardPlay";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { speakFn } from "../lib/speakFn";

const SWIPE_THRESHOLD = 120;

export type FlashcardCardHandle = {
  swipe: (grade: FlashcardGrade) => void;
};

interface FlashcardCardProps {
  card: FlashcardType;
  revealed: boolean;
  busy: boolean;
  onReveal: () => void;
  onDecide: (grade: FlashcardGrade) => void;
}

const FlashcardCard = forwardRef<FlashcardCardHandle, FlashcardCardProps>(
  function FlashcardCard({ card, revealed, busy, onReveal, onDecide }, ref) {
    const [offsetX, setOffsetX] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [exiting, setExiting] = useState<FlashcardGrade | null>(null);
    const [skipTransition, setSkipTransition] = useState(true);
    const startXRef = useRef(0);

    // Reset the card to its resting position whenever a new card arrives.
    useEffect(() => {
      setOffsetX(0);
      setDragging(false);
      setExiting(null);
      setSkipTransition(true);
      const id = requestAnimationFrame(() => setSkipTransition(false));
      return () => cancelAnimationFrame(id);
    }, [card.id]);

    const commit = (grade: FlashcardGrade) => {
      if (exiting || busy) return;
      const distance =
        (typeof window !== "undefined" ? window.innerWidth : 800) * 1.2;
      setExiting(grade);
      setOffsetX(grade === "easy" ? distance : -distance);
      onDecide(grade);
    };

    useImperativeHandle(ref, () => ({ swipe: commit }));

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      if (busy || exiting) return;
      if (!revealed) {
        onReveal();
        return;
      }
      setDragging(true);
      startXRef.current = e.clientX - offsetX;
      e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging) return;
      setOffsetX(e.clientX - startXRef.current);
    };

    const handlePointerUp = () => {
      if (!dragging) return;
      setDragging(false);
      if (offsetX > SWIPE_THRESHOLD) {
        commit("easy");
      } else if (offsetX < -SWIPE_THRESHOLD) {
        commit("hard");
      } else {
        setOffsetX(0);
      }
    };

    const rotation = offsetX / 18;
    const easyOpacity = Math.min(Math.max(offsetX / SWIPE_THRESHOLD, 0), 1);
    const hardOpacity = Math.min(Math.max(-offsetX / SWIPE_THRESHOLD, 0), 1);

    return (
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role="button"
        tabIndex={0}
        aria-label={revealed ? "Grade this card" : "Reveal answer"}
        onKeyDown={(e) => {
          if (busy || exiting) return;
          if (!revealed && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onReveal();
          } else if (revealed && e.key === "ArrowRight") {
            commit("easy");
          } else if (revealed && e.key === "ArrowLeft") {
            commit("hard");
          }
        }}
        className={cn(
          "relative flex h-72 w-full max-w-sm flex-col items-center justify-center gap-4 rounded-3xl border border-zinc-200 bg-white px-8 py-10 text-center shadow-xl select-none dark:border-zinc-800 dark:bg-zinc-900",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          revealed ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
        )}
        style={{
          transform: `translateX(${offsetX}px) rotate(${rotation}deg)`,
          opacity: exiting ? 0 : 1,
          transition:
            dragging || skipTransition
              ? "none"
              : "transform 1000ms ease, opacity 1000ms ease",
          touchAction: "pan-y",
        }}
      >
        <span
          className="pointer-events-none absolute top-6 left-6 -rotate-12 rounded-lg border-4 border-emerald-500 px-3 py-1 text-lg font-black tracking-wide text-emerald-500"
          style={{ opacity: easyOpacity }}
        >
          EASY
        </span>
        <span
          className="pointer-events-none absolute top-6 right-6 rotate-12 rounded-lg border-4 border-rose-500 px-3 py-1 text-lg font-black tracking-wide text-rose-500"
          style={{ opacity: hardOpacity }}
        >
          HARD
        </span>

        <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          {card.englishMeaning}
        </p>

        {revealed ? (
          <div className="flex items-center gap-2">
            <p className="text-lg text-zinc-500 dark:text-zinc-400">
              {card.english}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Pronounce word"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                speakFn(card.english);
              }}
              className="shrink-0"
            >
              <Volume2 className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Toggle slow pronunciation"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                speakFn(card.english, 0.1);
              }}
            >
              <Turtle className="size-4" />
            </Button>
          </div>
        ) : (
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            Tap to reveal
          </p>
        )}
      </div>
    );
  },
);

export default FlashcardCard;
