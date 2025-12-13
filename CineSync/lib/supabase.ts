import { createClient } from '@supabase/supabase-js';
import type { Movie, MovieSearchResult } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase configuration. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);



export async function searchMoviesByEmbedding(
  queryEmbedding: number[],
  similarityThreshold: number = 0.1,
  matchCount: number = 10
): Promise<MovieSearchResult[]> {
  try {
    const { data, error } = await supabase.rpc(
      'search_movies_by_embedding',
      {
        query_embedding: queryEmbedding,
        similarity_threshold: similarityThreshold,
        match_count: matchCount,
      }
    );

    if (error) {
      throw new Error(`Supabase RPC error: ${error.message}`);
    }

    return (data || []).map((movie: any) => ({
      ...movie,
      description: movie.overview,
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to search movies: ${error.message}`);
    }
    throw error;
  }
}
