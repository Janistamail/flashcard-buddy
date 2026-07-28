# 02 — Sentence mode lookup

**What to build:** Make the lever's Sentence mode functional. Clicking the lever (built in ticket 01) toggles between Word mode and Sentence mode. In Sentence mode, the user types a full English sentence into the same text input and submits via "Ask" or Enter (same trigger mechanism as Word mode). Submitting calls the existing `/api/vocab/lookup` endpoint with `{ mode: "sentence", text }`, using a sentence-specific system prompt that instructs the model to return only `{ thai: string }` (the natural Thai translation, in Thai script). The result renders read-only beneath the input, showing only the Thai translation — no English meaning, no examples, and critically **no Save button anywhere in this mode** — Sentence mode results are always transient and never persisted.

Flipping the lever in either direction must always reset to a blank slate: whatever input text and result/error was showing in the mode you're leaving is cleared, and the mode you're entering starts blank too. This applies to both directions (Word → Sentence and Sentence → Word).

Reuse the same inline-error-on-failure behavior from ticket 01 (network error, non-2xx, or malformed JSON → inline message near the input, "Ask" stays enabled for retry).

**Blocked by:** 01 (reuses the lever component, page skeleton, and the `/api/vocab/lookup` endpoint's request/response pattern)

**Status:** ready-for-agent

- [ ] Clicking the lever toggles `mode` between "word" and "sentence", with the lever's visual position updating via its existing CSS transition
- [ ] Sentence mode's input placeholder/labeling makes clear it expects a full sentence, not a single word
- [ ] Submitting in Sentence mode calls `/api/vocab/lookup` with `{ mode: "sentence", text }` and renders only the returned `thai` translation
- [ ] No Save button (or any persistence trigger) is rendered in Sentence mode under any state
- [ ] Switching modes in either direction clears the previous mode's input text, result, and any error message — both the mode being left and the mode being entered start blank
- [ ] AI call failures or malformed JSON in Sentence mode show the same inline-error-with-retry pattern as Word mode
