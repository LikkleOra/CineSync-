import { fetchMovieGenres } from '@/lib/utils/fetchTMDbData';
import CineSyncClient from './CineSyncClient';

export default async function Home() {
  const genres = await fetchMovieGenres();

  return <CineSyncClient genres={genres} />;
}

