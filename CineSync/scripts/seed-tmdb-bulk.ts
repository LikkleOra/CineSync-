import { createClient } from '@supabase/supabase-js';
import { fetchPopularMovies } from '../lib/utils/fetchTMDbData';
import { getEmbedding } from '../lib/server/embedding';
import dotenv from 'dotenv';
import { join } from 'path';

// Load env vars
dotenv.config({ path: join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase configuration.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedBulk() {
    console.log('🚀 Starting Bulk TMDb Seeding...');

    const START_PAGE = 1;
    const END_PAGE = 10; // 10 pages ~= 200 movies
    const BATCH_SIZE = 20;

    let totalInserted = 0;
    let totalFailed = 0;

    for (let page = START_PAGE; page <= END_PAGE; page++) {
        console.log(`\n📥 Fetching Page ${page}...`);
        try {
            const movies = await fetchPopularMovies(page);
            console.log(`   Found ${movies.length} movies.`);

            const moviesToInsert: any[] = [];

            for (const movie of movies) {
                // Skip if overview is empty
                if (!movie.description) {
                    console.log(`   ⚠️ Skipping "${movie.title}" (no description)`);
                    continue;
                }

                try {
                    // Generate Embedding using the server utility (has rate limiting & retry)
                    // Increased delay to stay under the 30/min limit in lib/server/embedding.ts
                    const { embedding } = await getEmbedding(movie.description);

                    moviesToInsert.push({
                        id: movie.id, // Ensure we use the ID for upserting
                        title: movie.title,
                        overview: movie.description, // Map description -> overview
                        genres: movie.genres,
                        poster_url: movie.poster_url,
                        release_date: movie.release_date,
                        popularity: movie.popularity,
                        vote_average: movie.vote_average,
                        embedding
                    });

                    process.stdout.write('.'); // Progress dot
                    await new Promise(r => setTimeout(r, 2200));

                } catch (err: any) {
                    console.error(`\n   ❌ Failed to associate embedding for "${movie.title}": ${err.message}`);
                    totalFailed++;
                }
            }

            if (moviesToInsert.length > 0) {
                console.log(`\n   💾 Upserting ${moviesToInsert.length} movies...`);
                const { error } = await supabase
                    .from('movies')
                    .upsert(moviesToInsert, { onConflict: 'id' });

                if (error) {
                    console.error('   ❌ Supabase Upsert Error:', error.message);
                } else {
                    totalInserted += moviesToInsert.length;
                    console.log('   ✅ Batch success!');
                }
            }

        } catch (err: any) {
            console.error(`   ❌ Failed to fetch page ${page}: ${err.message}`);
        }
    }

    console.log('\n✨ Seeding Complete!');
    console.log(`📊 Total Upserted: ${totalInserted}`);
    console.log(`⚠️ Total Failed Embeddings: ${totalFailed}`);
}

seedBulk().catch(console.error);
