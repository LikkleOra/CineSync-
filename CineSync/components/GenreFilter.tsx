'use client';

import { cn } from '@/lib/utils';

interface GenreFilterProps {
  genres: Array<{ id: number; name: string }>;
  selectedGenres: string[];
  onGenreSelect: (genre: string) => void;
}

export function GenreFilter({ genres, selectedGenres, onGenreSelect }: GenreFilterProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white">4. Filter by Genre (Optional)</h3>
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => onGenreSelect(genre.name)}
            className={cn(
              "px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200",
              selectedGenres.includes(genre.name)
                ? "bg-white/10 border-white text-white"
                : "bg-transparent border-white/20 text-muted-foreground hover:border-white/50 hover:text-white"
            )}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
}
