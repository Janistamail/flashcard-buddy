# 03 — Grade a card and advance through the session

**What to build:** On the `/flashcard` page, below the centered `englishMeaning` (from ticket 02), show **Easy** and **Hard** buttons for a blind self-grade — the user judges themselves before the answer is revealed. Clicking either button immediately calls an API to increment that card's `easyCount` or `hardCount` (not batched at session end), then reveals the card's `english` word beneath the meaning and shows a **Next** button.

Clicking **Next** advances to the next card in the session's pre-shuffled order, going back through the same load-meaning → blind-grade → reveal flow. Cards are not repeated within a session — each selected card is shown exactly once. After the last card, show a plain "Session complete" screen with a button back to the home page — no stats breakdown (no "Easy: 6, Hard: 4" summary).

**Blocked by:** 02 (this extends the `/flashcard` page and session-loading built there)

**Status:** ready-for-agent

- [ ] Easy and Hard buttons appear below the `englishMeaning`, before the answer is revealed
- [ ] Clicking Easy or Hard immediately calls an API that increments the current card's `easyCount` or `hardCount` respectively
- [ ] After grading, the card's `english` word is revealed beneath the meaning
- [ ] After grading, a Next button appears
- [ ] Clicking Next advances the session's index pointer and shows the next card's meaning (grading buttons again, answer hidden)
- [ ] No card is shown more than once within a session
- [ ] After the last card, a "Session complete" screen appears with a button back to the home page
- [ ] The completion screen shows no stats breakdown (no Easy/Hard tally)
