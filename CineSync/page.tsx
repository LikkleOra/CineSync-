import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MovieCard } from "@/components/MovieCard"
import { Movie } from "@/types"

export default function Home() {
  const [searchInput, setSearchInput] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [movies, setMovies] = useState<Movie[]>([])

  const handleSearch = async () => {
    if (!searchInput.trim()) return

    setLoading(true)
    try {
      // TODO: Implement actual search logic using Supabase
      // For now, we'll just simulate some movies
      const mockMovies = [
        {
          id: "1",
          title: "Inception",
          genres: ["action", "sci-fi"],
          description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
          poster_url: "https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
          embedding: [] // Will be populated by Supabase
        },
        {
          id: "2",
          title: "The Matrix",
          genres: ["action", "sci-fi"],
          description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
          poster_url: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
          embedding: []
        }
      ]
      setMovies(mockMovies)
    } catch (error) {
      console.error("Error searching movies:", error)
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
              
              {/* Genre filter - will be implemented later */}
              <div className="flex flex-wrap gap-2">
                {/* Genre buttons will be added here */}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onFavorite={() => {}}
              isFavorite={false}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
