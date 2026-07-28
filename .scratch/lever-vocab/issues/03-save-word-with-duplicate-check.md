# 03 — Save word to database, with duplicate check

**What to build:** Update the `Vocabulary` Prisma model (drop the unused `notes` field, add `englishMeaning: String` and `examples: String[]`) and apply the migration. Add a "Save" button beneath a Word mode lookup result (built in ticket 01) that persists the word as a Vocabulary entry: the word itself (`english`), `thai`, `englishMeaning`, and `examples`, exactly as returned by the AI lookup — the user cannot edit these fields before saving.

Before inserting, the existing `/api/vocab` POST route must check — case-insensitively — whether a Vocabulary row with the same `english` value already exists. If a match is found, do not insert; instead return a response the frontend uses to show a small dismiss-only modal (new `app/components/Modal.tsx` — backdrop click or Escape closes it, single "OK" button) with the text "This vocab already exists". If no match is found, insert normally and show lightweight inline success feedback (e.g. "Saved!") — no modal on success.

**Blocked by:** 01 (the Save button attaches to the Word mode result UI built there)

**Status:** ready-for-agent

- [ ] `prisma/schema.prisma`'s `Vocabulary` model has `english`, `thai`, `englishMeaning`, `examples: String[]`, `createdAt` — `notes` is removed
- [ ] Migration applied (`npx prisma migrate dev`) and the Prisma client regenerated at `app/generated/prisma` reflects the new fields
- [ ] A "Save" button appears under a Word mode result (never under a Sentence mode result)
- [ ] Clicking Save POSTs `{ english, thai, englishMeaning, examples }` to `/api/vocab`
- [ ] `/api/vocab` POST performs a case-insensitive lookup on `english` before creating; on a match it returns a non-2xx response without inserting a new row
- [ ] On a duplicate response, the frontend shows a dismiss-only `Modal` with the text "This vocab already exists" (closes via backdrop click or Escape)
- [ ] On a successful save, the frontend shows inline "Saved!" feedback (no modal)
- [ ] Saving the same word with different casing (e.g. "Apple" vs "apple") is treated as a duplicate
