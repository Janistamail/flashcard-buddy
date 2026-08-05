"use client";

import Image from "next/image";

const CONFETTI_COLORS = [
  "#facc15",
  "#f87171",
  "#60a5fa",
  "#4ade80",
  "#f472b6",
  "#a78bfa",
];

const CONFETTI_PIECES = Array.from({ length: 20 }, (_, i) => {
  const drift = ((i * 53) % 160) - 80;
  return {
    left: `${(i * 43) % 100}%`,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: `${(i % 10) * 0.2}s`,
    duration: `${2.4 + (i % 5) * 0.3}s`,
    size: 6 + (i % 3) * 2,
    drift: `${drift}px`,
    spin: `${360 + (i % 4) * 180}deg`,
  };
});

export default function VictoryCelebration() {
  return (
    <div className="relative flex h-48 w-48 items-center justify-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {CONFETTI_PIECES.map((piece, i) => (
          <span
            key={i}
            className="confetti-piece absolute top-0 rounded-sm"
            style={{
              left: piece.left,
              width: piece.size,
              height: piece.size * 0.4,
              backgroundColor: piece.color,
              animationDelay: piece.delay,
              animationDuration: piece.duration,
              ["--confetti-drift" as string]: piece.drift,
              ["--confetti-spin" as string]: piece.spin,
            }}
          />
        ))}
      </div>
      <Image
        src="/victory_cup.png"
        alt="Victory cup"
        width={128}
        height={128}
        className="victory-bounce relative z-10 h-32 w-32 object-contain"
        priority
      />
    </div>
  );
}
