import { createClient } from '@supabase/supabase-js';
import { fetchPopularMovies } from '../lib/utils/fetchTMDbData';
import { generateEmbedding } from '../lib/utils/generateEmbedding';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    'Missing Supabase configuration. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedMovies() {
  try {
    console.log('🎬 Starting movie database seed...\n');

    // Fetch popular movies from TMDb
    console.log('📥 Fetching popular movies from TMDb...');
    const movies = await fetchPopularMovies(1);
    console.log(`✅ Fetched ${movies.length} movies\n`);

    // Generate embeddings
    console.log('🤖 Generating embeddings for movies...');
    const moviesWithEmbeddings = await Promise.allSettled(
      movies.map(async (movie) => {
        try {
          const embedding = await generateEmbedding(movie.description);
          return { ...movie, embedding };
        } catch (error) {
          console.warn(`⚠️  Failed to embed "${movie.title}": ${error}`);
          return null;
        }
      })
    );

    const validMovies = moviesWithEmbeddings
      .map((result) => (result.status === 'fulfilled' ? result.value : null))
      .filter((m) => m !== null);

    console.log(
      `✅ Generated embeddings for ${validMovies.length}/${movies.length} movies\n`
    );

    if (validMovies.length === 0) {
      console.error('❌ No movies with embeddings. Aborting seed.');
      process.exit(1);
    }

    // Insert into Supabase
    console.log('💾 Inserting movies into Supabase...');
    const { error, data } = await supabase
      .from('movies')
      .insert(validMovies)
      .select();

    if (error) {
      console.error('❌ Supabase insert error:', error);
      process.exit(1);
    }

    console.log(`✅ Successfully inserted ${data?.length || 0} movies!\n`);
    console.log('🎉 Seed complete!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seedMovies();
