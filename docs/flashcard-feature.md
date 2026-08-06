# Feature: Flashcard Play Mode

## Summary

A play button (using `lunla_paws.png`) on the home page opens a modal to configure
a Play Session. The user picks how cards are selected ("Latest" or
"Forget the most") and how many, then is taken to a `/flashcard` page that steps
through the selected cards one at a time, showing the English meaning, letting
the user self-grade with Easy/Hard, then revealing the English word.

## Data model changes

Add two columns to `Vocabulary` (new Prisma migration):

```prisma
model Vocabulary {
  id             String   @id @default(cuid())
  english        String
  thai           String
  englishMeaning String
  examples       String[]
  createdAt      DateTime @default(now())
  easyCount      Int      @default(0)
  hardCount      Int      @default(0)
}
```

- Incremented via an immediate API call the instant Easy/Hard is clicked during
  a session (not batched at session end).

## Home page button

- `lunla_paws.png` rendered as an icon-only button, floating at the bottom of
  the home page.
- Clicking it opens the session-configuration modal.

## Play Session configuration modal

- Radio group with two options:
  - **Latest** (default selected)
  - **Forget the most**
- Number input for card count:
  - Defaults to `10`
  - Minimum valid value is `1`
  - OK button is disabled when the field is empty, `0`, negative, or
    non-numeric
- Empty database edge case: if there are zero vocab cards at all, the modal
  still opens, but OK stays disabled and a "No cards available yet" message is
  shown.
- On OK, the client calls an API with `{ mode, count }`. The server:
  1. Selects cards according to `mode`:
     - **Latest**: `ORDER BY createdAt DESC LIMIT count`
     - **Forget the most**: `ORDER BY hardCount DESC, createdAt DESC LIMIT count`
       (ties broken by most recently created)
  2. If fewer eligible cards exist than `count`, silently clamps to however
     many exist (no error shown).
  3. Shuffles the selected set into a fixed random order.
  4. Stores the ordered card list plus a current-index pointer in an
     in-memory `Map`, keyed by a generated ID for the Play Session (`sessionId`).
  5. Returns the Play Session's `sessionId` to the client.
- The client navigates to `/flashcard?session=<sessionId>`.

## `/flashcard` page

Flow per card:

1. Load the current card (by session + index) and show its `englishMeaning`
   centered on the page.
2. Show **Easy** and **Hard** buttons below the meaning.
3. Clicking either button (this is a blind self-grade — happens *before* the
   answer is revealed):
   - Increments that card's `easyCount` or `hardCount` immediately via API.
   - Reveals the `english` word beneath the meaning.
   - Shows a **Next** button.
4. Clicking **Next** advances to the next card in the pre-shuffled order.
   Cards are not repeated within a session — each of the selected cards is
   shown exactly once.
5. After the last card, show a plain "Session complete" screen with a button
   back to the home page. No stats breakdown is shown.

## Explicitly out of scope / decided against

- No stats summary (e.g. "Easy: 6, Hard: 4") on the completion screen.
- No ratio-based or difference-based ("hardCount - easyCount") forget ranking
  — ranking is purely `hardCount DESC`.
- No repeats of a card within the same session.
- No server-persisted Play Session table — Play Sessions live in an in-memory
  `Map` and are not expected to survive a server restart.
