export type Movie = {
  id: string;
  title: string;
  genres: string[];
  description: string;
  poster_url: string;
  embedding: number[];
};

export type Genre = 'action' | 'adventure' | 'animation' | 'comedy' | 'crime' | 'documentary' | 'drama' | 'family' | 'fantasy' | 'horror' | 'mystery' | 'romance' | 'sci-fi' | 'thriller';

export type MoodSearchInput = {
  mood: string;
  selectedGenres?: Genre[];
};

export type MovieCardProps = {
  movie: Movie;
  onFavorite: (movie: Movie) => void;
  isFavorite: boolean;
};
