"use client";

export type LeverMode = "word" | "sentence";

interface LeverProps {
  mode: LeverMode;
  onToggle: () => void;
}

const WORD_ANGLE = -30;
const SENTENCE_ANGLE = 30;

export default function Lever({ mode, onToggle }: LeverProps) {
  const isSentence = mode === "sentence";

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div className="flex w-56 justify-between px-3 text-xs font-semibold tracking-wide text-zinc-500 dark:text-zinc-400">
        <span className={!isSentence ? "text-zinc-900 dark:text-zinc-50" : ""}>
          WORD
        </span>
        <span className={isSentence ? "text-zinc-900 dark:text-zinc-50" : ""}>
          SENTENCE
        </span>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={isSentence}
        aria-label={`Mode: ${isSentence ? "Sentence" : "Word"}. Activate to switch.`}
        onClick={onToggle}
        className="h-40 w-40 cursor-pointer"
      >
        <svg viewBox="0 0 512 512" className="h-full w-full">
          {/* Base */}
          <rect x="30" y="435" width="452" height="50" rx="18" fill="#6B5B53" />

          {/* Platform */}
          <path
            d="M70 435
               L115 275
               Q120 255 140 255
               H372
               Q392 255 397 275
               L442 435 Z"
            fill="#CDB8A5"
          />

          {/* Lever */}
          <g
            style={{
              transformOrigin: "256px 255px",
              transform: `rotate(${isSentence ? SENTENCE_ANGLE : WORD_ANGLE}deg)`,
              transition: "transform 300ms ease-out",
            }}
          >
            {/* Arm */}
            <rect x="247" y="60" width="18" height="195" rx="9" fill="#E8E5E2" />

            {/* Large Red Ball */}
            <circle cx="256" cy="35" r="42" fill="#D62828" />

            {/* Highlight */}
            <circle cx="242" cy="21" r="12" fill="#FFD6D6" opacity="0.75" />
          </g>

          {/* Pivot */}
          <circle cx="256" cy="255" r="72" fill="#7B5A50" />

          {/* Pivot Center */}
          <circle cx="256" cy="255" r="28" fill="#EEDFD3" />
        </svg>
      </button>
    </div>
  );
}
