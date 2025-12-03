'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Film, Loader2 } from 'lucide-react';
import { MovieCard } from '@/components/MovieCard';
import { GenreFilter } from '@/components/GenreFilter';
import { useFavorites } from '@/hooks/useFavorites';
import type { Movie } from '@/types';

interface CineSyncClientProps {
  genres: Array<{ id: number; name: string }>;
}

export default function CineSyncClient({ genres }: CineSyncClientProps) {
  const [searchInput, setSearchInput] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchQuery: searchInput,
          selectedGenres,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to search movies');
      }

      const data = await response.json();
      setMovies(data.movies || []);

      if (data.movies.length === 0) {
        setError('No movies found. Try a different search.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      console.error('Search error:', err);
      setError(message);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black text-foreground overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center justify-center p-2 px-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4">
            <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />
            <span className="text-sm font-medium text-white/80">AI-Powered Discovery</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight bg-gradient-to-b from-white via-white/90 to-white/50 bg-clip-text text-transparent drop-shadow-2xl">
            CineSync
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Discover movies that match your exact mood. Just describe how you're feeling, and let AI do the magic.
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto mb-20"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative flex items-center bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
              <Search className="w-6 h-6 text-muted-foreground ml-4" />
              <input
                type="text"
                placeholder='How are you feeling? (e.g., "I want a mind-bending sci-fi with a twist")'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-transparent border-none px-4 py-4 text-lg text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-0"
                disabled={loading}
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-8 py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-8 space-y-3">
            <p className="text-sm font-medium text-muted-foreground ml-1">Filter by genre (optional)</p>
            <GenreFilter
              genres={genres}
              selectedGenres={selectedGenres}
              onGenreSelect={handleGenreToggle}
            />
          </div>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-md mx-auto mb-12 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-center"
            >
              {error}
            </motion.div>
          )}

          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative">
                <div className="w-16 h-16 border-4 border-white/10 border-t-purple-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Film className="w-6 h-6 text-white/20" />
                </div>
              </div>
              <p className="mt-4 text-muted-foreground animate-pulse">Curating your personalized list...</p>
            </motion.div>
          ) : movies.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {movies.map((movie, index) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onFavorite={() => toggleFavorite(movie.id)}
                  isFavorite={isFavorite(movie.id)}
                  index={index}
                />
              ))}
            </motion.div>
          ) : hasSearched ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Film className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">No movies found matching your criteria.</p>
              <p className="text-sm text-muted-foreground/60 mt-2">Try adjusting your search or filters.</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center py-20 opacity-50"
            >
              <Film className="w-20 h-20 text-muted-foreground/10 mx-auto mb-6" />
              <p className="text-lg text-muted-foreground/40">Ready to discover something new?</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
