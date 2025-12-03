import { fetchMovieGenres } from '@/lib/utils/fetchTMDbData';
import HomeClient from '@/components/HomeClient';

export default async function Home() {
  let genres: Array<{ id: number; name: string }> = [];

  try {
    genres = await fetchMovieGenres();
  } catch (error) {
    console.warn('Failed to fetch genres:', error);
    // Fallback or empty array to allow build to succeed
  }

  return <HomeClient genres={genres} />;
}
