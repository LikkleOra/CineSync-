import { useState, useEffect } from 'react'

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('favoriteMovies')
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites))
      }
    } catch (error) {
      console.error('Failed to parse favorites from localStorage', error)
    }
  }, [])

  const toggleFavorite = (movieId: string) => {
    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.includes(movieId)
        ? prevFavorites.filter(id => id !== movieId)
        : [...prevFavorites, movieId]

      localStorage.setItem('favoriteMovies', JSON.stringify(newFavorites))
      return newFavorites
    })
  }

  const isFavorite = (movieId: string) => favorites.includes(movieId)

  return { toggleFavorite, isFavorite }
}
