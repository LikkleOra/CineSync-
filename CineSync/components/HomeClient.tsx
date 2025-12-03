'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, Film } from 'lucide-react';
import { MoodSelector, type Mood } from '@/components/MoodSelector';
import { MediaTypeSelector, type MediaType } from '@/components/MediaTypeSelector';
import { VibeInput } from '@/components/VibeInput';
import { GenreFilter } from '@/components/GenreFilter';
import { MovieCard } from '@/components/MovieCard';
import { useFavorites } from '@/hooks/useFavorites';
import type { Movie } from '@/types';
import { cn } from '@/lib/utils';

interface HomeClientProps {
    genres: Array<{ id: number; name: string }>;
}

type Mode = 'solo' | 'group';

export default function HomeClient({ genres }: HomeClientProps) {
    const [mode, setMode] = useState<Mode>('solo');
    const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
    const [mediaType, setMediaType] = useState<MediaType>('movie');
    const [vibe, setVibe] = useState('');
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
        if (!selectedMood && !vibe && selectedGenres.length === 0) {
            setError('Please select a mood, enter a vibe, or pick a genre.');
            return;
        }

        setLoading(true);
        setError(null);
        setHasSearched(true);

        try {
            // Construct a search query from the inputs
            const searchQuery = [
                selectedMood ? `${selectedMood} mood` : '',
                vibe,
                mediaType !== 'any' ? mediaType : ''
            ].filter(Boolean).join(' ');

            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchQuery,
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
                setError('No movies found. Try a different combination.');
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

    return (
        <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black text-white overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-12 max-w-3xl">
                {/* Header */}
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center justify-center gap-2 text-2xl font-bold mb-2">
                        <Film className="w-8 h-8" />
                        <span>CineSync</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                        Find Your Next Movie Night
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Whether you&apos;re flying solo or syncing with your crew, let our AI find the perfect movie for your vibe.
                    </p>
                </div>

                {/* Mode Toggle */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex">
                        <button
                            onClick={() => setMode('solo')}
                            className={cn(
                                "px-8 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                mode === 'solo' ? "bg-white/10 text-white shadow-sm" : "text-muted-foreground hover:text-white"
                            )}
                        >
                            Solo Sync
                        </button>
                        <button
                            onClick={() => setMode('group')}
                            className={cn(
                                "px-8 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                mode === 'group' ? "bg-white/10 text-white shadow-sm" : "text-muted-foreground hover:text-white"
                            )}
                        >
                            Group Sync
                        </button>
                    </div>
                </div>

                {/* Solo Mode Form */}
                <AnimatePresence mode="wait">
                    {mode === 'solo' && !hasSearched ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">Find Your Vibe</h2>
                            </div>

                            <MoodSelector selectedMood={selectedMood} onSelect={setSelectedMood} />
                            <MediaTypeSelector selectedType={mediaType} onSelect={setMediaType} />
                            <VibeInput value={vibe} onChange={setVibe} />
                            <GenreFilter genres={genres} selectedGenres={selectedGenres} onGenreSelect={handleGenreToggle} />

                            <button
                                onClick={handleSearch}
                                disabled={loading}
                                className="w-full py-4 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white font-semibold text-lg transition-all duration-200 shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Find My Vibe</>}
                            </button>
                        </motion.div>
                    ) : mode === 'group' ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center py-20"
                        >
                            <p className="text-xl text-muted-foreground">Group Sync Coming Soon!</p>
                        </motion.div>
                    ) : (
                        // Results View
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold">Your Recommendations</h2>
                                <button
                                    onClick={() => {
                                        setHasSearched(false);
                                        setMovies([]);
                                    }}
                                    className="text-sm text-muted-foreground hover:text-white"
                                >
                                    Start Over
                                </button>
                            </div>

                            {movies.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {movies.map((movie, index) => (
                                        <MovieCard
                                            key={movie.id}
                                            movie={movie}
                                            onFavorite={() => toggleFavorite(movie.id)}
                                            isFavorite={isFavorite(movie.id)}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <p className="text-muted-foreground">{error || "No movies found."}</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
