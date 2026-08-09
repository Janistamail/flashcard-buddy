"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import type { Session } from "next-auth";
import BulkImportModal from "@/app/components/BulkImportModal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/app/lib/actions/auth";

export default function Navbar({ session }: { session: Session | null }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const user = session?.user;

  const menuItems = [
    {
      label: "Play Buddies With Me",
      onSelect: () => router.push("/"),
    },
    {
      label: "Chat With Me",
      onSelect: () => router.push("/chat"),
    },
    {
      label: "Give Me A Ton Of Buddies",
      onSelect: () => setBulkImportOpen(true),
    },
    {
      label: "Browsing Buddies",
      onSelect: () => router.push("/chat"),
    },
  ];

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <>
      <nav className="flex w-full items-center justify-between border-b border-zinc-200 px-6 py-3 dark:border-zinc-800">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50"
        >
          <Image
            src="/lunla_head.png"
            alt="Lunla Flashcard"
            width={32}
            height={32}
            className="size-8"
          />
          Lunla Flashcard
        </Link>

        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name ?? "Signed-in user"}
                  referrerPolicy="no-referrer"
                  width={32}
                  height={32}
                  className="size-8 rounded-full"
                />
              ) : (
                <div className="flex size-8 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                  {(user.name ?? "?").charAt(0).toUpperCase()}
                </div>
              )}
              <span className="hidden text-sm font-medium text-zinc-900 sm:inline dark:text-zinc-50">
                {user.name}
              </span>
            </div>
          )}

          {user && (
            <div ref={containerRef} className="relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
                className="h-12 w-12"
              >
                <Menu className="size-7 text-gray-600" />
              </Button>

              {menuOpen && (
                <div className="absolute right-0 top-full z-10 w-70 pt-1">
                  <div
                    role="menu"
                    className="rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    {menuItems.map((item, index) => (
                      <Button
                        key={item.label}
                        role="menuitem"
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setMenuOpen(false);
                          item.onSelect();
                        }}
                        className={cn(
                          "w-full justify-start rounded-none px-4 py-5 font-semibold text-md",
                          index < menuItems.length - 1 &&
                            "border-b border-b-zinc-300",
                        )}
                      >
                        {item.label}
                      </Button>
                    ))}
                    <form action={signOutAction}>
                      <Button
                        role="menuitem"
                        type="submit"
                        variant="ghost"
                        className="w-full justify-start rounded-none border-t border-t-zinc-300 px-4 py-5 text-md font-semibold"
                      >
                        Sign out
                      </Button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <BulkImportModal
        open={bulkImportOpen}
        onClose={() => setBulkImportOpen(false)}
      />
    </>
  );
}
