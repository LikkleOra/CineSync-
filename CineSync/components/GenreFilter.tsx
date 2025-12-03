'use client';

import { cn } from '@/lib/utils';

interface GenreFilterProps {
  genres: Array<{ id: number; name: string }>;
  selectedGenres: string[];
  onGenreSelect: (genre: string) => void;
}

export function GenreFilter({ genres, selectedGenres, onGenreSelect }: GenreFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {genres.map((genre) => {
        const isSelected = selectedGenres.includes(genre.name.toLowerCase());
        return (
          <button
            key={genre.id}
            onClick={() => onGenreSelect(genre.name.toLowerCase())}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border",
              isSelected
                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25 scale-105"
                : "bg-card/50 text-muted-foreground border-border hover:border-primary/50 hover:text-foreground hover:bg-card"
            )}
          >
            {genre.name}
          </button>
        );
      })}
    </div>
  );
}

