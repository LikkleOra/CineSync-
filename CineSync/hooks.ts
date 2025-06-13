import { useState, useEffect } from 'react'
import { Movie } from '@/types'
import { supabase } from './supabase'

export function useEmbeddings(input: string) {
  const [embedding, setEmbedding] = useState<number[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchEmbedding() {
      if (!input.trim()) return

      setLoading(true)
      setError(null)

      try {
        const response = await fetch('https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: input,
            options: {
              wait_for_model: true,
            },
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to generate embedding')
        }

        const data = await response.json()
        setEmbedding(data[0])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate embedding')
      } finally {
        setLoading(false)
      }
    }

    fetchEmbedding()
  }, [input])

  return { embedding, error, loading }
}

export function useSimilarMovies(embedding: number[] | null) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchSimilarMovies() {
      if (!embedding) return

      setLoading(true)
      setError(null)

      try {
        const { data, error } = await supabase
          .rpc('search_movies_by_embedding', {
            query_embedding: embedding,
            similarity_threshold: 0.1,
            match_count: 10
          })

        if (error) throw error
        if (!data) throw new Error('No movies found')

        setMovies(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch similar movies')
      } finally {
        setLoading(false)
      }
    }

    fetchSimilarMovies()
  }, [embedding])

  return { movies, error, loading }
}
