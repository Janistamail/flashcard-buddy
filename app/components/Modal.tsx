"use client";

import { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-900"
      >
        <p className="text-zinc-900 dark:text-zinc-50">{children}</p>
        <button
          type="button"
          onClick={onClose}
          className="self-end rounded-lg bg-zinc-900 px-4 py-1.5 font-medium text-white dark:bg-zinc-50 dark:text-zinc-900"
        >
          OK
        </button>
      </div>
    </div>
  );
}
