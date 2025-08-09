"use client"

import { Button } from "@/components/ui/button"

interface GenreFilterProps {
  genres: string[]
  selectedGenres: string[]
  onGenreChange: (selectedGenres: string[]) => void
}

export function GenreFilter({ genres, selectedGenres, onGenreChange }: GenreFilterProps) {
  const handleGenreClick = (genre: string) => {
    const newSelectedGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre]
    onGenreChange(newSelectedGenres)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {genres.map((genre) => (
        <Button
          key={genre}
          variant={selectedGenres.includes(genre) ? "default" : "outline"}
          onClick={() => handleGenreClick(genre)}
          className="capitalize"
        >
          {genre}
        </Button>
      ))}
    </div>
  )
}
