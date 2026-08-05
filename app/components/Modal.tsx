"use client";

import ModalShell from "@/app/components/ModalShell";
import { Button } from "@/components/ui/button";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, children }: ModalProps) {
  return (
    <ModalShell open={open} onClose={onClose}>
      <p className="text-zinc-900 dark:text-zinc-50">{children}</p>
      <Button type="button" onClick={onClose} className="self-end">
        OK
      </Button>
    </ModalShell>
  );
}
