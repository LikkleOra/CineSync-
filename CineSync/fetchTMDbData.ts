import axios from 'axios'
import { Movie } from '@/types'

const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

export interface TmdbMovie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  genre_ids: number[]
}

// Map TMDB genre IDs to our genre strings
const TMDB_GENRE_MAP: { [key: number]: string } = {
  28: 'action',
  12: 'adventure',
  16: 'animation',
  35: 'comedy',
  80: 'crime',
  99: 'documentary',
  18: 'drama',
  10751: 'family',
  14: 'fantasy',
  27: 'horror',
  9648: 'mystery',
  10749: 'romance',
  878: 'sci-fi',
  53: 'thriller',
}

export async function fetchMovieDetails(movieId: number): Promise<Movie> {
  try {
    const response = await axios.get(`${TMDB_API_BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
        language: 'en-US',
      },
    })

    const tmdbMovie = response.data as TmdbMovie
    const genres = tmdbMovie.genre_ids
      .map(id => TMDB_GENRE_MAP[id])
      .filter((genre): genre is string => genre !== undefined)

    return {
      id: tmdbMovie.id.toString(),
      title: tmdbMovie.title,
      genres,
      description: tmdbMovie.overview,
      poster_url: tmdbMovie.poster_path 
        ? `${TMDB_IMAGE_BASE_URL}${tmdbMovie.poster_path}`
        : '',
      embedding: [], // Will be populated later
    }
  } catch (error) {
    console.error(`Error fetching movie details for ${movieId}:`, error)
    throw error
  }
}

export async function fetchPopularMovies(page: number = 1): Promise<Movie[]> {
  try {
    const response = await axios.get(`${TMDB_API_BASE_URL}/movie/popular`, {
      params: {
        api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
        language: 'en-US',
        page,
      },
    })

    const movies = response.data.results as TmdbMovie[]
    return movies.map(movie => ({
      id: movie.id.toString(),
      title: movie.title,
      genres: movie.genre_ids
        .map(id => TMDB_GENRE_MAP[id])
        .filter((genre): genre is string => genre !== undefined),
      description: movie.overview,
      poster_url: movie.poster_path 
        ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
        : '',
      embedding: [], // Will be populated later
    }))
  } catch (error) {
    console.error(`Error fetching popular movies:`, error)
    throw error
  }
}

export async function fetchMovieGenres(): Promise<{ id: number; name: string }[]> {
  try {
    const response = await axios.get(`${TMDB_API_BASE_URL}/genre/movie/list`, {
      params: {
        api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
        language: 'en-US',
      },
    })
    return response.data.genres
  } catch (error) {
    console.error('Error fetching movie genres:', error)
    throw error
  }
}
