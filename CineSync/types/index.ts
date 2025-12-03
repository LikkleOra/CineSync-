export type Genre =
  | 'action'
  | 'adventure'
  | 'animation'
  | 'comedy'
  | 'crime'
  | 'documentary'
  | 'drama'
  | 'family'
  | 'fantasy'
  | 'horror'
  | 'mystery'
  | 'romance'
  | 'sci-fi'
  | 'thriller';

export interface Movie {
  id: string;
  title: string;
  genres: string[];
  description: string;
  poster_url: string;
  embedding: number[];
  created_at?: string;
}

export interface MovieSearchResult extends Movie {
  similarity: number;
}

export interface MoodSearchInput {
  mood: string;
  selectedGenres?: Genre[];
}

export interface MovieCardProps {
  movie: Movie;
  onFavorite: () => void;
  isFavorite: boolean;
}

export interface SearchResponse {
  movies: MovieSearchResult[];
  count: number;
}
