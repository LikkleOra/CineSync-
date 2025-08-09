"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MovieCard } from "./MovieCard"
import { Movie } from "../types"
import { GenreFilter } from "./GenreFilter"
import { supabase } from './supabase'

export default function Home() {
  const [searchInput, setSearchInput] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [movies, setMovies] = useState<Movie[]>([])
  const [genres, setGenres] = useState<string[]>([])

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const { data, error } = await supabase.rpc('get_all_genres')
        if (error) throw error
        setGenres(data.map((g: any) => g.genre))
      } catch (error) {
        console.error("Error fetching genres:", error)
      }
    }
    fetchGenres()
  }, [])

  const handleSearch = async () => {
    if (!searchInput.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api', {
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
        throw new Error('Failed to search movies')
      }

      const data = await response.json()
      setMovies(data.movies)
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
              
              <GenreFilter
                genres={genres}
                selectedGenres={selectedGenres}
                onGenreChange={setSelectedGenres}
              />
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
