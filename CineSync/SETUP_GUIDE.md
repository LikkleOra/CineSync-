# 🚀 CineSync Setup Guide

## ✅ Prerequisites Completed
- [x] API keys added to `.env.local`
- [x] Dev server running at http://localhost:3000
- [x] Vector dimensions fixed (384)

## 📊 Next Steps: Database Setup

### Step 1: Create Supabase Tables

1. **Go to your Supabase project:**
   - Visit: https://supabase.com/dashboard
   - Select your project (or create a new one)

2. **Open SQL Editor:**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the schema:**
   - Copy the entire contents of `supabase/schema.sql`
   - Paste into the SQL editor
   - Click "Run" or press Ctrl+Enter

4. **Verify:**
   - Go to "Table Editor"
   - You should see a `movies` table with columns:
     - id, title, overview, genre_ids, genres, poster_url, release_date, popularity, embedding, created_at

### Step 2: Seed Movies

Run this command to fetch and seed movies from TMDB:

```bash
npm run seed
```

**What this does:**
- Fetches popular movies from TMDB
- Generates embeddings for each movie description
- Inserts movies into your Supabase database

**Expected output:**
```
🎬 Starting movie database seed...
📥 Fetching popular movies from TMDb...
✅ Fetched 20 movies
🤖 Generating embeddings for movies...
✅ Generated embeddings for 20/20 movies
💾 Inserting movies into Supabase...
✅ Successfully inserted 20 movies!
🎉 Seed complete!
```

**Note:** This will take a few minutes due to:
- TMDB API rate limits
- Hugging Face embedding generation (first request might be slow)

### Step 3: Test the App

1. **Open the app:**
   - Visit: http://localhost:3000

2. **Try the flow:**
   - Select a mood (e.g., "Chill")
   - Choose media type (e.g., "Movies")
   - Optionally add a vibe (e.g., "action-packed adventure")
   - Select genres if desired
   - Click "Find My Vibe"

3. **Expected result:**
   - Loading animation
   - Grid of movie cards matching your preferences
   - Click "Start Over" to try again

## 🔧 Troubleshooting

### Issue: "Failed to search movies"
- **Check:** Supabase URL and keys in `.env.local`
- **Check:** Movies table exists and has data
- **Check:** `search_movies_by_embedding` function exists

### Issue: "Failed to generate embedding"
- **Check:** `HUGGINGFACE_API_KEY` is correct
- **Wait:** First request can take 20+ seconds (model loading)

### Issue: No movies returned
- **Check:** Database has movies (run `npm run seed`)
- **Try:** Lower similarity threshold in `app/api/search/route.ts` (line 42)
  - Change from `0.1` to `0.05` or `0.01`

## 📝 Optional: Add More Movies

To add more movies, edit `scripts/seed-movies.ts`:

```typescript
// Change this line (currently fetches page 1 = 20 movies)
const movies = await fetchPopularMovies(1);

// To fetch multiple pages:
const page1 = await fetchPopularMovies(1);
const page2 = await fetchPopularMovies(2);
const page3 = await fetchPopularMovies(3);
const movies = [...page1, ...page2, ...page3]; // 60 movies
```

Then run `npm run seed` again.

## 🎯 What's Working Now
- ✅ Landing page with Solo/Group toggle
- ✅ Mood, Media Type, Vibe, and Genre selection
- ✅ AI-powered movie recommendations
- ✅ Beautiful UI matching your screenshots
- ✅ Responsive design

## 🚧 Still To Build (Per PRD)
- [ ] Group Mode functionality
- [ ] Trailers (YouTube API)
- [ ] Watch Providers (JustWatch/TMDB)
- [ ] Movie Details Modal
- [ ] Advanced filters

---

**Ready to test?** Run the database setup steps above, then visit http://localhost:3000! 🎬
