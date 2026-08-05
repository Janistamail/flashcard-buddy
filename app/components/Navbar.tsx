"use client";

import { useEffect, useRef, useState } from "react";

export type NavMenuItem = {
  label: string;
  onSelect: () => void;
};

interface NavbarProps {
  menuItems: NavMenuItem[];
}

export default function Navbar({ menuItems }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    <nav className="flex w-full items-center justify-end border-b border-zinc-200 px-6 py-3 dark:border-zinc-800">
      <div
        ref={containerRef}
        className="relative"
        onMouseEnter={() => setMenuOpen(true)}
        onMouseLeave={() => setMenuOpen(false)}
      >
        <button
          type="button"
          aria-label="Menu"
          aria-haspopup="true"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex flex-col gap-1.5 rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900"
        >
          <span className="h-0.5 w-6 bg-zinc-900 dark:bg-zinc-50" />
          <span className="h-0.5 w-6 bg-zinc-900 dark:bg-zinc-50" />
          <span className="h-0.5 w-6 bg-zinc-900 dark:bg-zinc-50" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full z-10 w-56 pt-1">
            <div
              role="menu"
              className="rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
            >
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  role="menuitem"
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    item.onSelect();
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-zinc-900 hover:bg-zinc-100 dark:text-zinc-50 dark:hover:bg-zinc-800"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
