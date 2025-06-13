import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for Supabase
export type MovieEmbedding = {
  id: string
  embedding: number[]
}

export type MovieSearchResult = {
  id: string
  title: string
  genres: string[]
  description: string
  poster_url: string
  similarity: number
}
