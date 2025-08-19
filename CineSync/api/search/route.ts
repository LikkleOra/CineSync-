import { NextResponse } from 'next/server'
import { generateEmbedding } from '@/lib/utils/generateEmbedding'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { searchQuery, selectedGenres } = await request.json()

    if (!searchQuery?.trim()) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 })
    }

    // Generate embedding for search query
    const queryEmbedding = await generateEmbedding(searchQuery)

    // Query Supabase for similar movies
    const { data, error } = await supabase
      .rpc('search_movies_by_embedding', {
        query_embedding: queryEmbedding,
        similarity_threshold: 0.1,
        match_count: 10
      })

    if (error) {
      console.error('Error searching movies:', error)
      return NextResponse.json({ error: 'Failed to search movies' }, { status: 500 })
    }

    // Filter by selected genres if any are selected
    const filteredMovies = selectedGenres?.length
      ? data.filter((movie: any) => 
          movie.genres.some((genre: string) => 
            selectedGenres.includes(genre.toLowerCase())
          )
        )
      : data

    return NextResponse.json({ movies: filteredMovies })
  } catch (error) {
    console.error('Error in search route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
