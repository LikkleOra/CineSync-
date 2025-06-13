# CineSync - AI-Powered Movie Discovery

CineSync is a lightweight web application that helps you discover movies and TV shows based on your mood, vibes, and preferences. It uses AI-powered similarity search to find movies that match your current state of mind.

## Features

- Mood-based movie discovery
- Genre filtering
- Similarity search using AI embeddings
- Local favorites storage
- Modern, responsive UI

## Tech Stack

- Next.js 14+ (App Router)
- Tailwind CSS
- ShadCN UI
- Framer Motion
- Supabase (PostgreSQL + Edge Functions + pgvector)
- TMDb API
- Hugging Face Inference API

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and add your API keys:
   - TMDB_API_KEY
   - HUGGINGFACE_API_KEY
   - SUPABASE_URL
   - SUPABASE_ANON_KEY

4. Seed the database:
   ```bash
   npx ts-node scripts/seed-movies.ts
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment

1. Create a Vercel account if you don't have one
2. Connect your GitHub repository
3. Add environment variables in Vercel:
   - TMDB_API_KEY
   - HUGGINGFACE_API_KEY
   - SUPABASE_URL
   - SUPABASE_ANON_KEY

4. Deploy!

## License

MIT
