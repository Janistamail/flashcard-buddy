# 01 — Word mode lookup

**What to build:** A home page (`app/page.tsx`) with a literal skeuomorphic lever control (a hand-built CSS lever, not a plain toggle/checkbox — see `app/components/Lever.tsx` as the new component) that shows both "Word mode" and "Sentence mode" positions. In Word mode, the user types a single English word or phrase into a text input, then submits via an "Ask" button or by pressing Enter. Submitting calls a new `/api/vocab/lookup` endpoint (mode: "word") that prompts an AI model (OpenRouter, `meta-llama/llama-3.3-70b-instruct:free`, JSON response-format mode — mirror the existing `app/api/chat/route.ts` fetch/auth pattern) for a strict JSON reply: an English-language definition (`englishMeaning`), the Thai translation (`thai`, in Thai script), and exactly two example sentences (`examples`). The result renders read-only beneath the input. If the AI call fails or returns malformed/wrong-shaped JSON, show an inline error message near the input and leave "Ask" enabled for retry — no modal.

This ticket does not touch the database or add a Save button — that's ticket 03. Sentence mode does not need to be functional yet — that's ticket 02 — but the lever should visually support both positions since it's a shared component.

Domain vocabulary for this feature (Lever, Word mode, Sentence mode, Vocabulary) is recorded in `CONTEXT.md` at the repo root — use those terms in code/comments/naming rather than inventing new ones.

**Blocked by:** None — can start immediately

**Status:** ready-for-agent

- [ ] `app/components/Lever.tsx` exists: a skeuomorphic pivoting lever (CSS-only, no image assets, no animation library) that takes `mode` and `onToggle`, rendering a visibly different position for each mode
- [ ] `app/page.tsx` renders the lever plus a text input and "Ask" button, defaulting to Word mode
- [ ] Pressing Enter in the input or clicking "Ask" triggers the same submit action
- [ ] `app/api/vocab/lookup/route.ts` exists, accepts `{ mode: "word", text }`, calls OpenRouter with JSON response-format mode and a word-specific system prompt, and returns `{ englishMeaning, thai, examples: [string, string] }` on success
- [ ] Server-side validation rejects/reports malformed model output (wrong shape, unparseable JSON, non-2xx from OpenRouter) with a non-2xx response and an `error` message, rather than crashing or returning garbage
- [ ] On a successful lookup, the UI shows `englishMeaning`, `thai`, and both example sentences, read-only (no inline editing)
- [ ] On a failed lookup (network error, non-2xx response, or validation failure), the UI shows an inline error message near the input, and "Ask" remains clickable for retry
