import { NextRequest, NextResponse } from 'next/server';
import { generateEmbedding } from '@/lib/utils/generateEmbedding';
import { searchMoviesByEmbedding } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchQuery, selectedGenres } = body;

    // Validate input
    if (!searchQuery || typeof searchQuery !== 'string' || !searchQuery.trim()) {
      return NextResponse.json(
        { error: 'Search query is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (selectedGenres && !Array.isArray(selectedGenres)) {
      return NextResponse.json(
        { error: 'selectedGenres must be an array' },
        { status: 400 }
      );
    }

    // Generate embedding for search query
    let queryEmbedding: number[];
    try {
      queryEmbedding = await generateEmbedding(searchQuery.trim());
    } catch (error) {
      console.error('Embedding generation failed:', error);
      return NextResponse.json(
        { error: 'Failed to process search query. Please try again.' },
        { status: 500 }
      );
    }

    // Search movies by embedding
    let movies;
    try {
      movies = await searchMoviesByEmbedding(
        queryEmbedding,
        0.1, // similarity threshold
        10   // match count
      );
    } catch (error) {
      console.error('Movie search failed:', error);
      return NextResponse.json(
        { error: 'Failed to search movies. Please try again.' },
        { status: 500 }
      );
    }

    // Filter by selected genres if provided
    const filteredMovies = selectedGenres?.length
      ? movies.filter((movie) =>
          movie.genres.some((genre) =>
            selectedGenres.includes(genre.toLowerCase())
          )
        )
      : movies;

    return NextResponse.json({
      movies: filteredMovies,
      count: filteredMovies.length,
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
