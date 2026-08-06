---
status: accepted
---

# Google-only login via Auth.js v5, with database sessions and open sign-up

Flashcard Buddy is moving from a single shared Vocabulary list to a multi-user app where each User's Vocabulary is private. We decided to authenticate exclusively via Google OAuth, using Auth.js v5 (`next-auth@beta`) with its official `@auth/prisma-adapter` rather than hand-rolling the OAuth flow or picking a hosted auth provider (Clerk, Supabase Auth, etc.). Auth.js v5 is built natively for the Next.js App Router (the same `auth()` helper works in middleware, Server Components, and route handlers), and the Prisma adapter generates the `User`/`Account`/`Session`/`VerificationToken` tables directly in our existing Postgres database — no new datastore, no data leaving our DB. We accepted the risk of depending on a beta release (`5.0.0-beta.32`) because it's been in beta a long time, is what current App Router guides assume, and the v4 alternative fights the router's idioms throughout.

Sessions are database-backed (a `Session` row per login, deletable to revoke instantly) rather than JWT, since we already have Postgres wired up via Prisma and revocability matters more than shaving a DB round-trip. Sign-up is open — any Google account can sign in and gets its own private Vocabulary space; there is no invite list. Existing (pre-auth) Vocabulary rows are backfilled to the developer's own account as part of the migration, and `Vocabulary.userId` becomes a required foreign key going forward, not nullable.

Route protection is two-layered: `middleware.ts` redirects unauthenticated visitors away from protected pages to `/login`, but ownership scoping (which rows a User may see or write) is enforced independently inside each `app/api/vocab/*` route via `auth()` and a `userId` filter — middleware only gates page access, it can't scope row-level data.
