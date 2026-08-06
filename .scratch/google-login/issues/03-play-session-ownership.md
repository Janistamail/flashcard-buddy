# 03 — Scope Play Sessions to the signed-in user

**What to build:** Flashcard review (a Play Session) only ever pulls the signed-in user's own `Vocabulary`, and a Play Session can only be viewed or advanced by the user who started it — even if another signed-in user obtains or guesses its `sessionId`. Card selection in `app/api/flashcard/session/route.ts` ("Latest" / "Forget the most") filters by the caller's `userId`. Each Play Session record kept in the in-memory `Map` stores its owning `userId` alongside the card list and index pointer. The `[sessionId]` routes (`route.ts`, `advance`, `grade`) check that the caller's `userId` matches the Play Session's owner before reading or mutating it.

**Blocked by:** 02 (needs `Vocabulary.userId` to exist so card selection can be filtered per user)

**Status:** ready-for-agent

- [ ] Card selection in `app/api/flashcard/session/route.ts` (both "Latest" and "Forget the most") filters candidates to the caller's own `Vocabulary`
- [ ] Each Play Session stored in the in-memory `Map` records the `userId` of the user who created it
- [ ] `app/api/flashcard/session/[sessionId]/route.ts`, `/advance`, and `/grade` reject (403 or 404) any request where the caller's `userId` doesn't match the Play Session's owner
- [ ] Unauthenticated requests to any `app/api/flashcard/session*` route are rejected with 401
- [ ] A Play Session started by User A contains only User A's `Vocabulary` cards
- [ ] User B cannot view, advance, or grade User A's Play Session even when given or guessing its `sessionId`
