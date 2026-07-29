# 01 — Add easyCount/hardCount to the Vocabulary schema

**What to build:** Extend the `Vocabulary` Prisma model with two grading-tally columns, `easyCount` and `hardCount`, both integers defaulting to `0`. Generate and apply the migration and regenerate the Prisma client. No API or UI surface yet — this is foundational for the session-creation ranking ("Forget the most") and the per-card grading increments built in later tickets.

**Blocked by:** None — can start immediately

**Status:** ready-for-agent

- [ ] `prisma/schema.prisma`'s `Vocabulary` model has `easyCount Int @default(0)` and `hardCount Int @default(0)`
- [ ] A new migration exists under `prisma/migrations/` adding these columns
- [ ] Migration applied (`npx prisma migrate dev`) and the generated client at `app/generated/prisma` reflects the new fields
- [ ] Existing rows default to `easyCount = 0, hardCount = 0` after migration
