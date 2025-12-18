# Improved AI & Search Implementation and Verification Plan

This document refines and extends the current “Search Expansion & Regression Testing Plan” to align with the actual codebase and to ensure robust end-to-end functionality across embedding, search, and database layers. It adds missing critical steps, clarifies architecture decisions, and introduces measurable success criteria.

---

## Executive Summary

- Resolve critical route conflicts to guarantee a single, correct `/api/search` contract.
- Lock in environment and schema consistency to avoid import-time and runtime failures.
- Build a regression test suite that mirrors the production search flow.
- Implement scalable, rate-limited bulk seeding from TMDb with robust upsert semantics.
- Add diagnostics and metrics to validate success at API, DB, and UI layers.

---

## Preconditions and Architecture Alignment

Before proceeding, address these foundational items:

1) Remove Legacy Search Route (Blocker)
- Ensure only the App Router route handles `/api/search`:
  - Keep: `CineSync/app/api/search/route.ts` (expects `{ embedding, selectedGenres }`).
  - Remove or rename: `CineSync/api/search/route.ts` (legacy `{ searchQuery }`, wrong data mapping, references non-existent generateEmbedding).
- Rationale: Prevent payload mismatch, routing conflicts, and data shape incompatibilities (overview vs. description).

2) Environment Variables: Verify and Enforce
- Required:
  - `GEMINI_API_KEY`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Note: `lib/supabase.ts` throws at import if Supabase envs are missing; `lib/server/embedding.ts` throws if `GEMINI_API_KEY` is missing.
- Make the verification step mandatory before dev/test:
  ```bash
  node verify-env-vars.js
  ```

3) Embedding Model and DB Vector Dimensions
- DB schema uses `vector(768)` in `supabase/schema.sql`.
- The embedding model is Gemini `text-embedding-004` (768 dims), via `lib/server/embedding.ts`.
- Ensure seed scripts generate 768-d embeddings; otherwise, Supabase RPC calls will fail.

---

## Phase 1 — Regression Testing (Lock In Stability)

Formalize regression coverage by mirroring the real client → server flow.

### A. Create a tests/ Suite
- Directory structure:
  ```
  CineSync/tests/
    e2e-search.test.js      # End-to-end API flow
    db-rpc-search.test.js   # Direct Supabase RPC
    embedding.test.js       # Embedding endpoint tests
  ```
- Use Node and fetch/axios or supertest against the dev server. Keep tests CI-friendly with exit codes and clear logs.

### B. Test Cases to Include

1. Embedding API
   - Valid request returns `{ embedding: number[], dimensions: 768 }`.
   - Input validation: empty string or overly long text should 400.
   - Rate-limit behavior: rapid repeated calls trigger a 429-style error (as implemented in `lib/server/embedding.ts`).

2. Search API (End-to-End)
   - Flow: call `/api/embedding` → then `/api/search` with the embedding and empty selectedGenres.
   - Expect non-zero results when DB is seeded with compatible embeddings.
   - Confirm that items include `description` (mapped from `overview`).
   - Genre filtering: with `selectedGenres: ['Action']` results are non-empty and filtered.

3. Supabase RPC (Direct)
   - Use `test-search.js` or add a dedicated test to call `search_movies_by_embedding` directly with a known embedding.
   - Validates DB and RPC independent of Next.js.

### C. Add npm Test Script
- In `package.json`:
  ```json
  {
    "scripts": {
      "test": "node --test tests/**/*.test.js"
    }
  }
  ```

### D. Metrics for Phase 1
- All tests pass locally and in CI.
- `/api/embedding` and `/api/search` return 2xx for nominal requests.
- Non-zero results with general queries and seeded data.

---

## Phase 2 — Search Expansion (Bulk Seeding with TMDb)

Current state:
- `seed-direct.js` has a handful of hardcoded entries.
- `scripts/seed-movies.ts` fetches a single page and has no robust rate-limiting for embeddings.

### A. New Bulk Seeding Script

Create `scripts/seed-tmdb-bulk.ts` (or `.js`):
- Responsibilities:
  1. Fetch multiple pages from TMDb (popular/top-rated lists).
  2. Normalize movie data (title, overview, poster_url, genres, release_date, etc.).
  3. Generate embeddings using `lib/server/embedding.ts` calls or a simple HTTP call to your `/api/embedding` route.
     - Prefer server-side logic to reuse rate-limiting and retries.
  4. Insert or upsert into Supabase in batches (e.g., 25–50 per batch).
  5. Handle duplicates by `id` upsert.
  6. Resilient error handling and resumability.

### B. Execution Steps
```bash
# If using tsx:
npx tsx scripts/seed-tmdb-bulk.ts

# Or if using CommonJS:
node scripts/seed-tmdb-bulk.js
```

### D. Metrics for Phase 2
- Database row count > 100 after seeding.
- No dimension mismatch errors during RPC.
- Bulk seeding logs show successful insertions and minimal failures.
- Rerunning the script upserts without duplicates or constraint errors.

---

## Phase 3 — Manual Verification (UI and API)

1) UI Checks (HomeClient.tsx workflow)
- Provide vibe and/or select genres (e.g., “Action”, “Sci-Fi”).
- Trigger search; expect ≥ 3–5 recommendations when DB has > 100 entries.
- Verify no client errors in the console and no 500s from API routes.

2) API Checks
- `/api/embedding` responds with `{ embedding, dimensions }` (dimensions = 768).
- `/api/search` responds with `{ movies, count }`.

---

## Success Criteria (Measurable)

- Regression tests:
  - `npm test` passes locally and in CI.
- DB:
  - Row count ≥ 100 after bulk seed.
- API:
  - `/api/embedding`: ≥ 99% success at normal usage, correct dimensions.
  - `/api/search`: returns `count > 0` for general vibes with default threshold.
- UI:
  - HomeClient shows recommendations for typical vibes and common genres.

---

## Final Checklist

- [x] Phase 1 & 2: Search Stability & Expansion
- [x] Phase 3: Multimedia (Trailers & Watch Providers)
- [x] Phase 4: Reliability & Security Hardening (The 19-Point Sweep)
    - [x] [SEC] Mask TMDb API Key (Rename to TMDB_API_KEY)
    - [x] [SEC] Fix GEMIN_API_KEY typos
    - [x] [VALID] Stricter selectedGenres and text input validation
    - [x] [VALID] Movie genres null/undefined defensive checks
    - [x] [VALID] Case-insensitive genre filtering fix
    - [x] [RELIABILITY] Fix race conditions in MovieModal fetches
    - [x] [RELIABILITY] Validate trailer platform (YouTube only)
    - [x] [RELIABILITY] API key validation before rate-limit consumption
    - [x] [RELIABILITY] Replace fragile string-matching in errors
    - [x] [RELIABILITY] Comprehensive timeouts for all API/test requests
    - [x] [TESTING] Dynamic server-readiness check in E2E tests
    - [x] [TESTING] Stream consumption in network tests
    - [x] [CLEANUP] Remove unused constants and legacy routes
