import { Movie } from '@/types'

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: text,
      options: {
        wait_for_model: true,
      },
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to generate embedding')
  }

  const data = await response.json()
  return data[0]
}

export async function generateMovieEmbeddings(movies: Movie[]): Promise<Movie[]> {
  const promises = movies.map(async (movie) => {
    const embedding = await generateEmbedding(movie.description)
    return { ...movie, embedding }
  })

  return Promise.all(promises)
}
