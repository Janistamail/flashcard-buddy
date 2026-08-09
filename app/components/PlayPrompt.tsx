"use client";

import Image from "next/image";
import { useState } from "react";
import SessionModal from "@/app/components/SessionModal";

export default function PlayPrompt() {
  const [sessionModalOpen, setSessionModalOpen] = useState(false);

  return (
    <>
      <div className="group relative flex flex-col items-center">
        <span className="pointer-events-none absolute -top-24 whitespace-nowrap rounded-full bg-zinc-900 px-4 py-1.5 text-base font-semibold text-white opacity-0 translate-y-2 scale-95 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 dark:bg-zinc-50 dark:text-zinc-900">
          PLAY WITH ME!
        </span>
        <Image
          onClick={() => setSessionModalOpen(true)}
          src="/lunla_dance.png"
          alt=""
          width={280}
          height={280}
          className="object-contain cursor-pointer transition-transform duration-300 ease-out group-hover:scale-110"
        />
      </div>
      {sessionModalOpen && (
        <SessionModal onClose={() => setSessionModalOpen(false)} />
      )}
    </>
  );
}
