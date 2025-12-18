'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Star, Heart, Play, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Movie } from '@/types';
import { useEffect, useState } from 'react';

interface MovieExtras {
    tagline: string | null;
    runtime: number | null;
    trailer: { key: string; site: string } | null;
    providers: {
        flatrate?: Array<{ provider_id: number; provider_name: string; logo_path: string }>;
        rent?: Array<{ provider_id: number; provider_name: string; logo_path: string }>;
        buy?: Array<{ provider_id: number; provider_name: string; logo_path: string }>;
    } | null;
}

interface MovieModalProps {
    movie: Movie | null;
    isOpen: boolean;
    onClose: () => void;
    onFavorite: (movieId: number) => void;
    isFavorite: boolean;
}

export function MovieModal({ movie, isOpen, onClose, onFavorite, isFavorite }: MovieModalProps) {
    const [extras, setExtras] = useState<MovieExtras | null>(null);
    const [loadingExtras, setLoadingExtras] = useState(false);

    // Fetch movie extras when modal opens
    useEffect(() => {
        let isCancelled = false;

        if (!isOpen || !movie) {
            setExtras(null);
            return;
        }

        const fetchExtras = async () => {
            setLoadingExtras(true);
            try {
                const response = await fetch(`/api/movies/${movie.id}/extras`);
                if (response.ok && !isCancelled) {
                    const data = await response.json();
                    setExtras(data);
                }
            } catch (error) {
                if (!isCancelled) {
                    console.error('Failed to fetch movie extras:', error);
                }
            } finally {
                if (!isCancelled) {
                    setLoadingExtras(false);
                }
            }
        };

        fetchExtras();

        return () => {
            isCancelled = true;
        };
    }, [isOpen, movie]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

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
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl pointer-events-auto"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/70 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="grid md:grid-cols-[2fr,3fr] gap-0">
                                {/* Image Section */}
                                <div className="relative h-64 md:h-full min-h-[400px]">
                                    <div className="absolute inset-0">
                                        <img
                                            src={movie.poster_url}
                                            alt={movie.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent" />
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-6 md:p-8 space-y-6">
                                    <div>
                                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                            {movie.title}
                                        </h2>
                                        {(extras?.tagline || movie.tagline) && (
                                            <p className="text-lg text-white/60 italic font-medium">
                                                "{extras?.tagline || movie.tagline}"
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                                        {movie.release_date && (
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4 text-purple-400" />
                                                <span>{new Date(movie.release_date).getFullYear()}</span>
                                            </div>
                                        )}
                                        {(extras?.runtime || movie.runtime) && (
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4 text-blue-400" />
                                                <span>
                                                    {Math.floor((extras?.runtime || movie.runtime || 0) / 60)}h {(extras?.runtime || movie.runtime || 0) % 60}m
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1.5">
                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            <span>{movie.vote_average?.toFixed(1)}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {Array.isArray(movie.genres) && movie.genres.map((genre) => (
                                            <span
                                                key={genre}
                                                className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-white/10"
                                            >
                                                {genre}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold text-white">Overview</h3>
                                        <p className="text-white/70 leading-relaxed">
                                            {movie.description}
                                        </p>
                                    </div>

                                    <div className="pt-4 flex items-center gap-4">
                                        <Button
                                            onClick={() => onFavorite(movie.id)}
                                            variant="outline"
                                            className={`gap-2 border-white/10 hover:bg-white/10 ${isFavorite ? 'text-red-500 hover:text-red-400' : 'text-white'
                                                }`}
                                        >
                                            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                                            {isFavorite ? 'In Favorites' : 'Add to Favorites'}
                                        </Button>
                                    </div>

                                    {/* Trailer Section */}
                                    {loadingExtras ? (
                                        <div className="py-8 flex flex-col items-center justify-center gap-3 text-white/40 bg-white/5 rounded-xl border border-white/10">
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            <span className="text-sm">Fetching trailer...</span>
                                        </div>
                                    ) : extras?.trailer && extras.trailer.site === 'YouTube' ? (
                                        <div className="space-y-3">
                                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                                <Play className="w-4 h-4 text-red-500 fill-red-500" />
                                                Official Trailer
                                            </h3>
                                            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10 shadow-xl">
                                                <iframe
                                                    src={`https://www.youtube.com/embed/${extras.trailer.key}`}
                                                    title={`${movie.title} Trailer`}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="absolute inset-0 w-full h-full"
                                                />
                                            </div>
                                        </div>
                                    ) : !loadingExtras && (!extras?.trailer || extras?.trailer?.site !== 'YouTube') && (
                                        <div className="py-4 text-sm text-white/40 italic">
                                            Trailer not available or platform not supported.
                                        </div>
                                    )}

                                    {/* Watch Providers */}
                                    {extras?.providers && (
                                        <div className="space-y-4 pt-4 border-t border-white/10">
                                            <h3 className="text-lg font-semibold text-white">Where to Watch</h3>

                                            {extras.providers.flatrate && (
                                                <div className="space-y-3">
                                                    <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider">Stream</h4>
                                                    <div className="flex flex-wrap gap-4">
                                                        {extras.providers.flatrate.map(p => (
                                                            <div key={p.provider_id} className="group relative">
                                                                <img
                                                                    src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                                                                    alt={p.provider_name}
                                                                    className="w-10 h-10 rounded-lg border border-white/10 transition-transform group-hover:scale-110"
                                                                />
                                                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-white text-black text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
                                                                    {p.provider_name}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {(extras.providers.rent || extras.providers.buy) && (
                                                <div className="space-y-3">
                                                    <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider">Rent / Buy</h4>
                                                    <div className="flex flex-wrap gap-4">
                                                        {[...(extras.providers.rent || []), ...(extras.providers.buy || [])]
                                                            .filter((v, i, a) => a.findIndex(t => t.provider_id === v.provider_id) === i)
                                                            .map(p => (
                                                                <div key={p.provider_id} className="group relative">
                                                                    <img
                                                                        src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                                                                        alt={p.provider_name}
                                                                        className="w-10 h-10 rounded-lg border border-white/10 transition-transform group-hover:scale-110 grayscale group-hover:grayscale-0"
                                                                    />
                                                                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-white text-black text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
                                                                        {p.provider_name}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
