# 01 — Auth foundation: sign in and out with Google

**What to build:** Users can sign in with their Google account and sign out again, with the whole app gated behind login. The Prisma schema gains Auth.js's adapter tables (`User`, `Account`, `Session`, `VerificationToken`), backed by our existing Postgres DB. Auth.js v5 (`next-auth@beta`) is configured with Google as the sole provider and database-backed sessions (`@auth/prisma-adapter`), exposed via an `app/api/auth/[...nextauth]` route handler. A dedicated `/login` page shows a "Sign in with Google" button. `middleware.ts` redirects any unauthenticated visitor to `/login` for every other route, then returns them to the page they originally requested once signed in. The existing global `Navbar` shows the signed-in user's avatar/name (from their Google profile) with a sign-out control, visible on every page.

This ticket does not touch `Vocabulary` — it remains global/unscoped. Ownership is added in ticket 02.

**Note (manual, not agent-verifiable):** A human needs to create OAuth 2.0 credentials in Google Cloud Console (redirect URI `http://localhost:3000/api/auth/callback/google`) and set `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, and `AUTH_SECRET` in `.env` before this ticket can be exercised end-to-end.

**Blocked by:** None — can start immediately

**Status:** ready-for-agent

- [ ] Prisma schema includes the Auth.js adapter models (`User`, `Account`, `Session`, `VerificationToken`) matching `@auth/prisma-adapter`'s required shape, migrated into the DB
- [ ] `next-auth@beta` (v5) and `@auth/prisma-adapter` are installed and configured with Google as the only provider
- [ ] Session strategy is `"database"` (sessions are rows in the `Session` table, not JWTs)
- [ ] `app/api/auth/[...nextauth]/route.ts` handles the Google OAuth flow (sign-in, callback, sign-out)
- [ ] `/login` page renders a "Sign in with Google" button and nothing else gated behind it
- [ ] `middleware.ts` redirects unauthenticated requests to `/login` for every page except `/login` itself
- [ ] After a successful sign-in, the user lands back on the page they originally tried to visit (not always the home page)
- [ ] `Navbar` shows the signed-in user's avatar/name and a sign-out control on every page when a session exists
- [ ] Clicking sign-out clears the session (deletes the `Session` row) and redirects to `/login`
- [ ] Signing in with any Google account succeeds — there is no allowlist
