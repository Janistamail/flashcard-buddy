"use client";

import Image from "next/image";
import { useState, type ReactNode, type SyntheticEvent } from "react";
import BulkImportModal from "@/app/components/BulkImportModal";
import Lever, { LeverMode } from "@/app/components/Lever";
import Modal from "@/app/components/Modal";
import Navbar from "@/app/components/Navbar";
import SessionModal from "@/app/components/SessionModal";
import { useVocabLookup } from "@/app/hooks/useVocabLookup";
import { useSaveVocab } from "@/app/hooks/useSaveVocab";
import { isSentenceLookupResult, isWordLookupResult } from "@/app/lib/vocab";
import pawPrintIcon from "@/app/lunla_paws.png";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightTerm(text: string, term: string): ReactNode {
  const trimmed = term.trim();
  if (!trimmed) return text;

  const parts = text.split(new RegExp(`(${escapeRegExp(trimmed)})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === trimmed.toLowerCase() ? (
      <strong key={i}>{part}</strong>
    ) : (
      part
    )
  );
}

export default function Home() {
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [mode, setMode] = useState<LeverMode>("word");
  const [text, setText] = useState("");
  const [queriedText, setQueriedText] = useState("");
  const { result, error, loading, lookup, reset } = useVocabLookup();
  const {
    status: saveStatus,
    error: saveError,
    duplicate,
    save,
    dismissDuplicate,
    reset: resetSave,
  } = useSaveVocab();

  const handleToggle = () => {
    setMode((m) => (m === "word" ? "sentence" : "word"));
    setText("");
    setQueriedText("");
    reset();
    resetSave();
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setQueriedText(trimmed);
    resetSave();
    await lookup(mode, trimmed);
  };

  const handleSave = () => {
    if (!isWordLookupResult(result) || saveStatus !== "idle") return;
    save({
      english: result.didYouMean ?? queriedText,
      thai: result.thai.join(", "),
      englishMeaning: result.englishMeaning,
      examples: result.examples,
    });
  };

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <Navbar
        menuItems={[
          {
            label: "Bulk Import (JSON)",
            onSelect: () => setBulkImportOpen(true),
          },
        ]}
      />

      <main className="flex w-full max-w-xl flex-col items-center gap-8 px-6 py-16">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Flashcard Buddy
        </h1>

        <Lever mode={mode} onToggle={handleToggle} />

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={loading}
              placeholder={
                mode === "word"
                  ? "Enter a word, idiom, acronym, phrase, sentence…"
                  : "Enter a sentence…"
              }
              className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 outline-none focus:border-zinc-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-5 py-2 font-medium text-white disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
            >
              {loading && (
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                  aria-hidden="true"
                />
              )}
              {loading ? "Asking…" : "Ask"}
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}

          {result && mode === "sentence" && isSentenceLookupResult(result) && (
            <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-lg text-zinc-900 dark:text-zinc-50">
                {result.thai}
              </p>
            </div>
          )}

          {result && mode === "word" && isWordLookupResult(result) && (
            <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              {result.didYouMean && (
                <p className="text-sm italic text-zinc-500 dark:text-zinc-400">
                  Did you mean <span className="font-medium">{result.didYouMean}</span>?
                </p>
              )}
              <p className="text-zinc-900 dark:text-zinc-50">{result.englishMeaning}</p>
              <p className="text-lg text-zinc-900 dark:text-zinc-50">
                {result.thai.join(", ")}
              </p>
              <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
                {result.examples.map((example, i) => (
                  <li key={i}>
                    {highlightTerm(example, result.didYouMean ?? queriedText)}
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saveStatus !== "idle"}
                  className="rounded-lg bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
                >
                  {saveStatus === "saving" ? "Saving…" : "Save"}
                </button>
                {saveStatus === "saved" && (
                  <span className="text-sm text-green-600 dark:text-green-400">
                    Saved!
                  </span>
                )}
                {saveError && (
                  <span
                    className="text-sm text-red-600 dark:text-red-400"
                    role="alert"
                  >
                    {saveError}
                  </span>
                )}
              </div>
            </div>
          )}
        </form>
      </main>
        <div className="group relative mt-auto mb-14 flex flex-col items-center">
          <span className="pointer-events-none absolute -top-11 whitespace-nowrap rounded-full bg-zinc-900 px-4 py-1.5 text-base font-semibold text-white opacity-0 translate-y-2 scale-95 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 dark:bg-zinc-50 dark:text-zinc-900">
            PLAY WITH ME!
          </span>
          <Image
            onClick={() => setSessionModalOpen(true)}
            src={pawPrintIcon}
            alt=""
            width={200}
            height={200}
            className="object-contain cursor-pointer transition-transform duration-300 ease-out group-hover:scale-110"
          />
        </div>
      {sessionModalOpen && (
        <SessionModal onClose={() => setSessionModalOpen(false)} />
      )}

      <Modal open={duplicate} onClose={dismissDuplicate}>
        This vocab already exists
      </Modal>

      <BulkImportModal
        open={bulkImportOpen}
        onClose={() => setBulkImportOpen(false)}
      />
    </div>
  );
}
