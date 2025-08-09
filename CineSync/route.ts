import { NextResponse } from 'next/server'
import { generateEmbedding } from './generateEmbedding'
import { supabase } from './supabase'

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
        match_count: 10,
        genre_filter: selectedGenres?.length ? selectedGenres : null
      })

    if (error) {
      console.error('Error searching movies:', error)
      return NextResponse.json({ error: 'Failed to search movies' }, { status: 500 })
    }

    return NextResponse.json({ movies: data })
  } catch (error) {
    console.error('Error in search route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
