export type WordLookupResult = {
  englishMeaning: string;
  thai: string[];
  examples: [string, string];
  didYouMean: string | null;
};

export function isWordLookupResult(value: unknown): value is WordLookupResult {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.englishMeaning === "string" &&
    v.englishMeaning.trim().length > 0 &&
    Array.isArray(v.thai) &&
    v.thai.length > 0 &&
    v.thai.every((t) => typeof t === "string" && t.trim().length > 0) &&
    Array.isArray(v.examples) &&
    v.examples.length === 2 &&
    v.examples.every((ex) => typeof ex === "string" && ex.trim().length > 0) &&
    (v.didYouMean === null ||
      (typeof v.didYouMean === "string" && v.didYouMean.trim().length > 0))
  );
}

export type SentenceLookupResult = {
  thai: string;
};

export function isSentenceLookupResult(
  value: unknown
): value is SentenceLookupResult {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.thai === "string" && v.thai.trim().length > 0;
}

export type VocabularyInput = {
  english: string;
  thai: string;
  englishMeaning: string;
  examples: string[];
};

function trimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function parseVocabularyInput(value: unknown): VocabularyInput | null {
  if (typeof value !== "object" || value === null) return null;
  const v = value as Record<string, unknown>;

  const english = trimmedString(v.english);
  const thai = trimmedString(v.thai);
  const englishMeaning = trimmedString(v.englishMeaning);
  const examples = Array.isArray(v.examples) ? v.examples : null;

  if (
    !english ||
    !thai ||
    !englishMeaning ||
    !examples ||
    !examples.every((ex) => typeof ex === "string")
  ) {
    return null;
  }

  return { english, thai, englishMeaning, examples };
}
