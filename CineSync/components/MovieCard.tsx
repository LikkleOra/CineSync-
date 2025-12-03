'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Movie } from '@/types';

interface MovieCardProps {
  movie: Movie;
  onFavorite: () => void;
  isFavorite: boolean;
  index?: number;
}

export function MovieCard({ movie, onFavorite, isFavorite, index = 0 }: MovieCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative h-full"
    >
      <Card className="h-full overflow-hidden border-0 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10 hover:bg-card/60">
        <div className="relative aspect-[2/3] w-full overflow-hidden">
          <img
            src={imageError ? 'https://via.placeholder.com/500x750?text=No+Poster' : movie.poster_url}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

          <div className="absolute top-3 right-3 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onFavorite();
              }}
              className="h-10 w-10 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 text-white transition-all hover:scale-110"
            >
              <Heart
                className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'
                  }`}
              />
            </Button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
            <h3 className="text-xl font-heading font-bold text-white line-clamp-2 mb-1 drop-shadow-md">
              {movie.title}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center text-yellow-400">
                <Star className="h-4 w-4 fill-current" />
                <span className="ml-1 text-sm font-medium text-white/90">
                  {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                </span>
              </div>
              <span className="text-white/60 text-sm">•</span>
              <span className="text-white/80 text-sm font-medium">
                {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
              </span>
            </div>

            <p className="text-sm text-white/70 line-clamp-3 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
              {movie.description}
            </p>

            {movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
                {movie.genres.slice(0, 3).map((genre) => (
                  <span
                    key={genre}
                    className="inline-block rounded-full bg-white/10 backdrop-blur-md px-2 py-0.5 text-[10px] font-medium text-white border border-white/10"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
