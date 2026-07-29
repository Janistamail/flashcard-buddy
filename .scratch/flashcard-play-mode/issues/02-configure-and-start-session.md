# 02 — Configure and start a flashcard session

**What to build:** A `lunla_paws.png` icon-only button floats at the bottom of the home page. Clicking it opens a session-configuration modal with a mode radio group (**Latest**, default; **Forget the most**) and a card-count number input (default `10`, minimum `1`). The OK button is disabled when the count is empty, `0`, negative, or non-numeric. If there are zero vocab cards in the database at all, the modal still opens but OK stays disabled and a "No cards available yet" message is shown instead.

On OK, the client calls a new session-creation API with `{ mode, count }`. The server selects cards by `createdAt DESC` (Latest) or `hardCount DESC, createdAt DESC` (Forget the most, ties broken by most recent), clamping silently to however many cards exist if fewer than `count` are available. It shuffles the selected set into a fixed random order and stores the ordered list plus a current-index pointer in an in-memory `Map` keyed by a generated `sessionId`, returning that `sessionId` to the client.

The client navigates to `/flashcard?session=<sessionId>`, which loads the current card for that session (by session + index) and shows its `englishMeaning` centered on the page. This ticket covers loading and displaying the first card only — self-grading, revealing the answer, and advancing are built in the next ticket.

**Blocked by:** 01 (session ranking and future grading both depend on the `hardCount`/`easyCount` columns existing)

**Status:** ready-for-agent

- [ ] Icon-only button rendering `lunla_paws.png` floats at the bottom of the home page
- [ ] Clicking the button opens the session-configuration modal
- [ ] Modal shows a radio group with "Latest" (default selected) and "Forget the most"
- [ ] Modal shows a number input for card count, defaulting to `10`, minimum valid value `1`
- [ ] OK is disabled when the count field is empty, `0`, negative, or non-numeric
- [ ] When there are zero vocab cards in the database, the modal still opens, OK stays disabled, and "No cards available yet" is shown
- [ ] On OK, the client POSTs `{ mode, count }` to a session-creation API
- [ ] Server-side "Latest" selects cards via `ORDER BY createdAt DESC LIMIT count`
- [ ] Server-side "Forget the most" selects cards via `ORDER BY hardCount DESC, createdAt DESC LIMIT count`
- [ ] If fewer eligible cards exist than `count`, the server silently clamps to however many exist (no error)
- [ ] The selected set is shuffled into a fixed random order and stored, with a current-index pointer, in an in-memory `Map` keyed by a generated `sessionId`
- [ ] The API returns `sessionId`, and the client navigates to `/flashcard?session=<sessionId>`
- [ ] `/flashcard` loads the current card for the session (by session + index) and shows its `englishMeaning` centered on the page
