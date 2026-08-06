# 02 — Vocabulary ownership: private per-user vocab

**What to build:** Each signed-in user's `Vocabulary` is private to them. `Vocabulary` gains a required `userId` foreign key to `User`. Since rows already exist from before login existed, the column is added nullable first, backfilled so every existing row is owned by the developer's own account, then altered to required. `app/api/vocab/route.ts` (list + create) and `app/api/vocab/bulk/route.ts` (bulk create) are scoped to the signed-in user: reads only return the caller's own vocab, writes are stamped with the caller's `userId`, and bulk import's duplicate-checking is scoped to the caller's own vocab rather than global.

**Blocked by:** 01 (needs a real `User` row — created by actually signing in — to backfill existing `Vocabulary` rows onto, and needs a live session to scope by)

**Status:** ready-for-agent

- [ ] Migration adds a nullable `userId` (FK to `User`) column on `Vocabulary`
- [ ] Backfill sets `userId` on every pre-existing `Vocabulary` row to the developer's own `User` id
- [ ] Follow-up migration makes `Vocabulary.userId` required (`NOT NULL`)
- [ ] `GET` in `app/api/vocab/route.ts` returns only the signed-in user's own `Vocabulary` rows
- [ ] `POST` in `app/api/vocab/route.ts` stamps new rows with the signed-in user's `userId`
- [ ] `app/api/vocab/bulk/route.ts` checks duplicates against the caller's own vocab only (not other users') and stamps inserted rows with the caller's `userId`
- [ ] Unauthenticated requests to `app/api/vocab/route.ts` and `app/api/vocab/bulk/route.ts` are rejected with 401
- [ ] Signing in as two different Google accounts shows two disjoint vocab lists — neither can see the other's entries
- [ ] Vocab that existed before this ticket is visible only under the developer's own account
