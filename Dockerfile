# =========================
# Base
# =========================
FROM node:22-alpine AS base

# Activate the exact pnpm version used by the project once, for every stage
RUN corepack enable && corepack prepare pnpm@11.17.0 --activate


# =========================
# Dependencies
# =========================
FROM base AS deps

WORKDIR /app

# Copy dependency files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile


# =========================
# Builder
# =========================
FROM base AS builder

WORKDIR /app

# Avoid pnpm's interactive "confirm modules purge" prompt during non-TTY builds
ENV CI=true

# Copy installed dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY . .

# Generate Prisma Client
# No real database connection is needed for prisma generate
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" pnpm prisma generate

# Build Next.js
RUN pnpm build


# =========================
# Production Runner
# =========================
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

# Copy production files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Cloud Run listens on port 8080
EXPOSE 8080

# Start Next.js directly — no pnpm needed at runtime, everything is already
# built, and pnpm's deps-status-check would fail here anyway since only
# package.json (not the lockfile/workspace config) is copied into this stage.
CMD ["node_modules/.bin/next", "start"]
