"use client";

import { useState, type SyntheticEvent } from "react";
import Lever, { LeverMode } from "@/app/components/Lever";
import SaveVocabModal, {
  type SaveVocabModalValues,
} from "@/app/components/SaveVocabModal";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useVocabLookup } from "@/app/hooks/useVocabLookup";
import { isSentenceLookupResult, isWordLookupResult } from "@/app/lib/vocab";
import { highlightTerm } from "@/app/lib/highlight";

export default function Chat() {
  const [mode, setMode] = useState<LeverMode>("word");
  const [text, setText] = useState("");
  const [queriedText, setQueriedText] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const { result, error, loading, lookup, reset } = useVocabLookup();

  const handleToggle = () => {
    setMode((m) => (m === "word" ? "sentence" : "word"));
    setText("");
    setQueriedText("");
    reset();
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setQueriedText(trimmed);
    await lookup(mode, trimmed);
  };

  const handleSave = () => {
    if (!isWordLookupResult(result) || editOpen) return;
    setEditOpen(true);
  };

  const editInitialValues: SaveVocabModalValues = isWordLookupResult(result)
    ? {
        word: result.didYouMean ?? queriedText,
        englishMeaning: result.englishMeaning,
        thai: result.thai.join(", "),
        example1: result.examples[0] ?? "",
        example2: result.examples[1] ?? "",
      }
    : { word: "", englishMeaning: "", thai: "", example1: "", example2: "" };

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-xl flex-col items-center gap-8 px-6 pt-20">
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
            <Button type="submit" disabled={loading || !text.trim()}>
              {loading && <Spinner />}
              {loading ? "Asking…" : "Ask"}
            </Button>
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
                  Did you mean{" "}
                  <span className="font-medium">{result.didYouMean}</span>?
                </p>
              )}
              <p className="text-zinc-900 dark:text-zinc-50">
                {result.englishMeaning}
              </p>
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
              <Button
                type="button"
                onClick={handleSave}
                disabled={editOpen}
                size="lg"
                className="mt-5"
              >
                SAVE
              </Button>
            </div>
          )}
        </form>
      </main>

      {editOpen && (
        <SaveVocabModal
          initialValues={editInitialValues}
          onClose={() => setEditOpen(false)}
        />
      )}
    </div>
  );
}
