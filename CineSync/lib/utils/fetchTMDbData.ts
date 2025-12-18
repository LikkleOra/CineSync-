import axios from 'axios';

const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  genre_ids: number[];
  release_date: string;
  popularity: number;
  vote_average: number;
}

export interface TmdbMovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  genres: Array<{ id: number; name: string }>;
}

// Map TMDB genre IDs to normalized genre strings
const TMDB_GENRE_MAP: Record<number, string> = {
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
};

function validateApiKey(): string {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_TMDB_API_KEY is not configured');
  }
  return apiKey;
}

function buildPosterUrl(posterPath: string | null): string {
  if (!posterPath) {
    return 'https://via.placeholder.com/500x750?text=No+Poster';
  }
  return `${TMDB_IMAGE_BASE_URL}${posterPath}`;
}

export async function fetchMovieDetails(movieId: number) {
  try {
    const apiKey = validateApiKey();
    const response = await axios.get(
      `${TMDB_API_BASE_URL}/movie/${movieId}`,
      {
        params: {
          api_key: apiKey,
          language: 'en-US',
        },
      }
    );

    const movie = response.data as TmdbMovieDetails;

    // Extract genres from the genres array (not genre_ids)
    const genres = movie.genres
      .map((g) => TMDB_GENRE_MAP[g.id] || g.name.toLowerCase())
      .filter((genre): genre is string => genre !== undefined);

    return {
      id: movie.id.toString(),
      title: movie.title,
      genres,
      description: movie.overview || 'No description available',
      poster_url: buildPosterUrl(movie.poster_path),
      embedding: [] as number[],
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `TMDb API error for movie ${movieId}: ${error.response?.status} ${error.message}`
      );
    }
    throw error;
  }
}

export async function fetchPopularMovies(page: number = 1) {
  try {
    const apiKey = validateApiKey();
    const response = await axios.get(
      `${TMDB_API_BASE_URL}/movie/popular`,
      {
        params: {
          api_key: apiKey,
          language: 'en-US',
          page,
        },
      }
    );

    const movies = response.data.results as TmdbMovie[];
    return movies.map((movie) => ({
      id: movie.id.toString(),
      title: movie.title,
      genres: movie.genre_ids
        .map((id) => TMDB_GENRE_MAP[id])
        .filter((genre): genre is string => genre !== undefined),
      description: movie.overview || 'No description available',
      poster_url: buildPosterUrl(movie.poster_path),
      release_date: movie.release_date,
      popularity: movie.popularity,
      vote_average: movie.vote_average,
      embedding: [] as number[],
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`TMDb API error fetching popular movies: ${error.message}`);
    }
    throw error;
  }
}

export async function fetchTopRatedMovies(page: number = 1) {
  try {
    const apiKey = validateApiKey();
    const response = await axios.get(
      `${TMDB_API_BASE_URL}/movie/top_rated`,
      {
        params: {
          api_key: apiKey,
          language: 'en-US',
          page,
        },
      }
    );

    const movies = response.data.results as TmdbMovie[];
    return movies.map((movie) => ({
      id: movie.id.toString(),
      title: movie.title,
      genres: movie.genre_ids
        .map((id) => TMDB_GENRE_MAP[id])
        .filter((genre): genre is string => genre !== undefined),
      description: movie.overview || 'No description available',
      poster_url: buildPosterUrl(movie.poster_path),
      release_date: movie.release_date,
      popularity: movie.popularity,
      vote_average: movie.vote_average,
      embedding: [] as number[],
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`TMDb API error fetching top rated movies: ${error.message}`);
    }
    throw error;
  }
}

export async function fetchMovieGenres() {
  try {
    const apiKey = validateApiKey();
    const response = await axios.get(
      `${TMDB_API_BASE_URL}/genre/movie/list`,
      {
        params: {
          api_key: apiKey,
          language: 'en-US',
        },
      }
    );
    return response.data.genres as Array<{ id: number; name: string }>;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`TMDb API error fetching genres: ${error.message}`);
    }
    throw error;
  }
}

export interface TmdbVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export async function fetchMovieVideos(movieId: number) {
  try {
    const apiKey = validateApiKey();
    const response = await axios.get(
      `${TMDB_API_BASE_URL}/movie/${movieId}/videos`,
      {
        params: {
          api_key: apiKey,
          language: 'en-US',
        },
      }
    );
    return response.data.results as TmdbVideo[];
  } catch (error) {
    console.error(`Failed to fetch videos for movie ${movieId}:`, error);
    return [];
  }
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface WatchProvidersResponse {
  results: {
    US?: {
      flatrate?: WatchProvider[];
      rent?: WatchProvider[];
      buy?: WatchProvider[];
    };
  };
}

export async function fetchWatchProviders(movieId: number) {
  try {
    const apiKey = validateApiKey();
    const response = await axios.get(
      `${TMDB_API_BASE_URL}/movie/${movieId}/watch/providers`,
      {
        params: {
          api_key: apiKey,
        },
      }
    );
    return (response.data as WatchProvidersResponse).results.US;
  } catch (error) {
    console.error(`Failed to fetch watch providers for movie ${movieId}:`, error);
    return null;
  }
}
