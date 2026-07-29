"use client";

import ModalShell from "@/app/components/ModalShell";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, children }: ModalProps) {
  return (
    <ModalShell open={open} onClose={onClose}>
      <p className="text-zinc-900 dark:text-zinc-50">{children}</p>
      <button
        type="button"
        onClick={onClose}
        className="self-end rounded-lg bg-zinc-900 px-4 py-1.5 font-medium text-white dark:bg-zinc-50 dark:text-zinc-900"
      >
        OK
      </button>
    </ModalShell>
  );
}
