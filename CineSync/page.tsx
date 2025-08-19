import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MovieCard } from "@/components/MovieCard"
import { Movie } from "@/types"
import { useFavorites } from "@/hooks"

export default function Home() {
  const [searchInput, setSearchInput] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [movies, setMovies] = useState<Movie[]>([])
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const { toggleFavorite, isFavorite } = useFavorites()

  const availableGenres = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Romance', 'Thriller', 'Fantasy']

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    )
  }

  const handleSearch = async () => {
    if (!searchInput.trim()) return

    setLoading(true)
    setError(null)
    setHasSearched(true)
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
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Something went wrong')
      }

      const data = await response.json()
      setMovies(data.movies)
    } catch (err: any) {
      console.error("Error searching movies:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">CineSync</h1>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="How are you feeling? (e.g., "I want something cozy and funny")"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button onClick={handleSearch} disabled={loading}>
                  {loading ? "Searching..." : "Find Movies"}
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {availableGenres.map(genre => (
                  <Button
                    key={genre}
                    variant={selectedGenres.includes(genre.toLowerCase()) ? 'default' : 'outline'}
                    onClick={() => handleGenreToggle(genre.toLowerCase())}
                  >
                    {genre}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-center col-span-3">Loading...</p>
          ) : movies.length > 0 ? (
            movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onFavorite={() => toggleFavorite(movie.id)}
                isFavorite={isFavorite(movie.id)}
              />
            ))
          ) : hasSearched ? (
            <p className="text-center col-span-3 text-muted-foreground">
              No movies found. Try a different search.
            </p>
          ) : (
            <p className="text-center col-span-3 text-muted-foreground">
              Find your next favorite movie!
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
