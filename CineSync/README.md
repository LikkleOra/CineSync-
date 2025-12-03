# CineSync - AI-Powered Movie Discovery

Discover movies based on your mood and preferences using AI-powered similarity search.

## Features

- 🎬 Mood-based movie discovery
- 🏷️ Genre filtering
- 🤖 AI embeddings for semantic search
- ❤️ Local favorites storage
- 🎨 Modern, responsive UI
- 🌙 Dark mode support

## Tech Stack

- **Frontend**: Next.js 14+, React 18, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL + pgvector)
- **AI**: Hugging Face Inference API (sentence-transformers)
- **APIs**: TMDb API
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account (free tier available)
- TMDb API key (free)
- Hugging Face API key (free)

## Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/cinesync.git
cd cinesync
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your API keys:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_TMDB_API_KEY=your-tmdb-key
HUGGINGFACE_API_KEY=your-hf-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Set Up Supabase

1. Create a Supabase project at https://supabase.com
2. Run the SQL migrations in `scripts/migrations.sql` in Supabase SQL Editor
3. Enable pgvector extension: `CREATE EXTENSION IF NOT EXISTS vector;`

### 4. Seed Database

```bash
npm run seed
```

This fetches popular movies from TMDb, generates embeddings, and stores them in Supabase.

### 5. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Project Structure

```
cinesync/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # UI components (card, button, etc.)
│   ├── MovieCard.tsx     # Movie display component
│   └── GenreFilter.tsx   # Genre filter component
├── lib/                   # Utilities and helpers
│   ├── utils/            # Utility functions
│   └── supabase.ts       # Supabase client
├── hooks/                # React hooks
│   └── useFavorites.ts   # Favorites management
├── types/                # TypeScript types
│   └── index.ts          # Type definitions
├── scripts/              # Utility scripts
│   ├── seed-movies.ts    # Database seeding
│   └── migrations.sql    # Database migrations
├── public/               # Static assets
├── .env.example          # Environment variables template
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── tailwind.config.ts    # Tailwind config
└── README.md             # This file
```

## API Keys Setup

### TMDb API

1. Go to https://www.themoviedb.org/settings/api
2. Create an API key (free account required)
3. Add to `.env.local` as `NEXT_PUBLIC_TMDB_API_KEY`

### Hugging Face

1. Go to https://huggingface.co/settings/tokens
2. Create an API token
3. Add to `.env.local` as `HUGGINGFACE_API_KEY`

### Supabase

1. Create project at https://supabase.com
2. Get URL and keys from project settings
3. Add to `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (for seeding)

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
# Or deploy via CLI
npm i -g vercel
vercel
```

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run seed     # Seed database with movies
```

### Database Migrations

To add new migrations, create SQL files in `scripts/migrations/` and run them in Supabase SQL Editor.

## Troubleshooting

### "Failed to generate embedding"
- Check `HUGGINGFACE_API_KEY` is set correctly
- Ensure API key has sufficient quota
- Check network connectivity

### "No movies found"
- Run `npm run seed` to populate database
- Check Supabase connection
- Verify pgvector extension is enabled

### "Search returns no results"
- Try different search terms
- Check that movies are seeded in database
- Verify Supabase RPC function exists

## Performance Optimization

- Images are lazy-loaded
- Embeddings cached in Supabase
- IVFFlat index for fast similarity search
- Next.js automatic code splitting

## Future Enhancements

- [ ] User authentication
- [ ] Personalized recommendations
- [ ] Movie watchlist
- [ ] Social sharing
- [ ] Advanced filters (year, rating, etc.)
- [ ] Mobile app

## License

MIT

## Contributing

Contributions welcome! Please open an issue or submit a PR.

## Support

For issues or questions, please open a GitHub issue.
