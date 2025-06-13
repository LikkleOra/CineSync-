import { createClient } from '@supabase/supabase-js'
import { fetchPopularMovies } from '../src/lib/utils/fetchTMDbData'
import { generateEmbedding } from '../src/lib/utils/generateEmbedding'
import { Movie } from '../src/types'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!
const huggingfaceApiKey = process.env.HUGGINGFACE_API_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function seedMovies() {
  try {
    console.log('Fetching popular movies...')
    const movies = await fetchPopularMovies(1)
    
    console.log(`Found ${movies.length} movies. Generating embeddings...`)
    
    // Generate embeddings for all movies
    const moviesWithEmbeddings = await Promise.all(
      movies.map(async (movie) => {
        try {
          const embedding = await generateEmbedding(movie.description)
          return { ...movie, embedding }
        } catch (error) {
          console.error(`Failed to generate embedding for ${movie.title}:`, error)
          return null
        }
      })
    )

    // Filter out any movies that failed to get embeddings
    const validMovies = moviesWithEmbeddings.filter((m): m is Movie => m !== null)

    console.log(`Successfully generated embeddings for ${validMovies.length} movies.`)

    // Insert movies into Supabase
    console.log('Inserting movies into Supabase...')
    const { error } = await supabase
      .from('movies')
      .insert(validMovies)

    if (error) {
      throw error
    }

    console.log('Successfully inserted movies into Supabase!')
  } catch (error) {
    console.error('Error seeding movies:', error)
    process.exit(1)
  }
}

seedMovies()
