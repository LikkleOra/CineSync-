import { NextRequest, NextResponse } from 'next/server';
import { searchMoviesByEmbedding } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  console.log('🔍 Search API called');

  try {
    const body = await request.json();
    const { embedding, selectedGenres } = body;
    console.log('📝 Request body:', { embeddingLength: embedding?.length, selectedGenres });

    // Validate embedding
    if (!embedding || !Array.isArray(embedding)) {
      console.log('❌ Invalid embedding');
      return NextResponse.json(
        { error: 'Embedding is required and must be an array' },
        { status: 400 }
      );
    }

    if (embedding.length !== 768) {
      console.log('❌ Invalid embedding dimensions');
      return NextResponse.json(
        { error: `Invalid embedding dimensions: expected 768, got ${embedding.length}` },
        { status: 400 }
      );
    }

    if (selectedGenres && !Array.isArray(selectedGenres)) {
      console.log('❌ Invalid selectedGenres');
      return NextResponse.json(
        { error: 'selectedGenres must be an array' },
        { status: 400 }
      );
    }

    // Search movies by embedding
    let movies;
    try {
      console.log('🔄 Searching movies in database...');
      movies = await searchMoviesByEmbedding(
        embedding,
        0.1, // similarity threshold
        10   // match count
      );
      console.log('✅ Found', movies.length, 'movies');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown search error';
      console.error('❌ Movie search failed:', errorMessage);
      return NextResponse.json(
        { error: `Movie search failed: ${errorMessage}` },
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

    console.log('✅ Returning', filteredMovies.length, 'filtered movies');
    return NextResponse.json({
      movies: filteredMovies,
      count: filteredMovies.length,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Search API error:', errorMessage, error);
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
