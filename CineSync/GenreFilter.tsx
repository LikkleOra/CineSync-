import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { fetchMovieGenres } from "@/lib/utils/fetchTmdpData"

interface GenreFilterProps {
  selectedGenres: string[]
  onGenreSelect: (genre: string) => void
}

export function GenreFilter({ selectedGenres, onGenreSelect }: GenreFilterProps) {
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await fetchMovieGenres()
        setGenres(data)
      } catch (error) {
        console.error("Error fetching genres:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGenres()
  }, [])

  if (loading) {
    return <div className="flex gap-2">Loading genres...</div>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {genres.map((genre) => (
        <Button
          key={genre.id}
          variant={selectedGenres.includes(genre.name.toLowerCase()) ? "default" : "outline"}
          size="sm"
          onClick={() => onGenreSelect(genre.name.toLowerCase())}
          className="capitalize"
        >
          {genre.name}
        </Button>
      ))}
    </div>
  )
}
