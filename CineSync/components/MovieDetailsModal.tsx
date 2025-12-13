'use client';

import { useEffect, useState } from 'react';
import { X, Play, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchMovieVideos, fetchWatchProviders, type TmdbVideo, type WatchProvider } from '@/lib/utils/fetchTMDbData';
import type { Movie } from '@/types';

interface MovieDetailsModalProps {
    movie: Movie | null;
    isOpen: boolean;
    onClose: () => void;
}

export function MovieDetailsModal({ movie, isOpen, onClose }: MovieDetailsModalProps) {
    const [trailer, setTrailer] = useState<TmdbVideo | null>(null);
    const [providers, setProviders] = useState<{
        flatrate?: WatchProvider[];
        rent?: WatchProvider[];
        buy?: WatchProvider[];
    } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!movie || !isOpen) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const movieId = parseInt(movie.id);

                // Fetch trailer
                const videos = await fetchMovieVideos(movieId);
                const officialTrailer = videos.find(
                    (v) => v.type === 'Trailer' && v.site === 'YouTube' && v.official
                ) || videos.find((v) => v.type === 'Trailer' && v.site === 'YouTube');
                setTrailer(officialTrailer || null);

                // Fetch watch providers
                const watchProviders = await fetchWatchProviders(movieId);
                setProviders(watchProviders || null);
            } catch (error) {
                console.error('Failed to fetch movie details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [movie, isOpen]);

    if (!movie) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:max-h-[90vh] bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>

                        {/* Content */}
                        <div className="overflow-y-auto max-h-full">
                            {/* Header with Poster */}
                            <div className="relative h-64 md:h-80">
                                <img
                                    src={movie.poster_url}
                                    alt={movie.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

                                <div className="absolute bottom-6 left-6 right-6">
                                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                        {movie.title}
                                    </h2>
                                    <div className="flex items-center gap-4 text-sm text-white/80">
                                        {movie.release_date && (
                                            <span>{new Date(movie.release_date).getFullYear()}</span>
                                        )}
                                        {movie.vote_average && (
                                            <span className="flex items-center gap-1">
                                                ⭐ {movie.vote_average.toFixed(1)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-6">
                                {/* Genres */}
                                <div className="flex flex-wrap gap-2">
                                    {movie.genres.map((genre) => (
                                        <span
                                            key={genre}
                                            className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium"
                                        >
                                            {genre}
                                        </span>
                                    ))}
                                </div>

                                {/* Overview */}
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Overview</h3>
                                    <p className="text-white/70 leading-relaxed">{movie.description}</p>
                                </div>

                                {/* Trailer */}
                                {loading ? (
                                    <div className="text-white/50">Loading trailer...</div>
                                ) : trailer ? (
                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-3">Trailer</h3>
                                        <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                                            <iframe
                                                src={`https://www.youtube.com/embed/${trailer.key}`}
                                                title={trailer.name}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="w-full h-full"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-white/50">No trailer available</div>
                                )}

                                {/* Watch Providers */}
                                {providers && (
                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-3">Where to Watch</h3>

                                        {providers.flatrate && providers.flatrate.length > 0 && (
                                            <div className="mb-4">
                                                <h4 className="text-sm font-medium text-white/60 mb-2">Stream</h4>
                                                <div className="flex flex-wrap gap-3">
                                                    {providers.flatrate.map((provider) => (
                                                        <div
                                                            key={provider.provider_id}
                                                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                                                        >
                                                            <img
                                                                src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                                                                alt={provider.provider_name}
                                                                className="w-8 h-8 rounded"
                                                            />
                                                            <span className="text-sm text-white">{provider.provider_name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {providers.rent && providers.rent.length > 0 && (
                                            <div className="mb-4">
                                                <h4 className="text-sm font-medium text-white/60 mb-2">Rent</h4>
                                                <div className="flex flex-wrap gap-3">
                                                    {providers.rent.map((provider) => (
                                                        <div
                                                            key={provider.provider_id}
                                                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                                                        >
                                                            <img
                                                                src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                                                                alt={provider.provider_name}
                                                                className="w-8 h-8 rounded"
                                                            />
                                                            <span className="text-sm text-white">{provider.provider_name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {!providers.flatrate && !providers.rent && !providers.buy && (
                                            <p className="text-white/50">No streaming options available in your region</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
