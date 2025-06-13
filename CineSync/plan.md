# CineSync MVP Plan

## Notes
- No user accounts/authentication for MVP
- Prioritize speed, creativity, and discovery ("Spotify Discover Weekly for movies")
- Use Next.js 14+ (App Router), Tailwind CSS, ShadCN UI, Framer Motion for frontend
- Use Supabase (Postgres + Edge Functions + pgvector), TMDb API, Hugging Face Inference API for backend/AI
- All API keys in .env with type-safe access
- Minimal cost: free-tier services only
- Clean folder structure, TypeScript throughout

## Task List
- [x] Set up Next.js 14+ project with App Router
- [x] Integrate Tailwind CSS, ShadCN UI, Framer Motion
- [x] Scaffold folder structure: /components, /lib, /app (or /pages)
- [x] Set up Supabase project and database
  - [x] Create Supabase client config in /lib
  - [x] Create movies table (id, title, genres, description, poster_url, embedding)
  - [x] Enable pgvector extension
- [x] Integrate TMDb API (fetch poster, title, overview, genres)
- [x] Integrate Hugging Face API (sentence-transformers/all-MiniLM-L6-v2)
  - [x] Script to embed movie descriptions and store in Supabase
- [x] Create Supabase Edge Function or Next.js API route for similarity search
  - [x] Accept user input, fetch embedding, query movies table by cosine similarity
  - [x] Return top 5-10 similar results
- [x] Build UI components:
  - [x] Mood/Vibe input field
  - [x] Genre multi-select filter
  - [x] Submit button
  - [x] Results grid (MovieCard component: poster, title, overview, add to favorites)
  - [x] Loading, error, and empty states
- [x] Implement localStorage for favorites
- [x] Add hooks: useEmbeddings, useSimilarMovies
- [x] Add utils: generateEmbedding.ts, compareEmbeddings.ts, fetchTMDbData.ts
- [x] Add .env support for all API keys
- [x] Deploy to Vercel

## Current Goal
MVP review & polish