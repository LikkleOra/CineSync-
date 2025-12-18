import { createClient } from '@supabase/supabase-js';
import { fetchPopularMovies, fetchTopRatedMovies } from '../lib/utils/fetchTMDbData';
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

async function seedEnhanced() {
    console.log('🚀 Starting Enhanced Bulk TMDb Seeding (Accuracy + Variety)...');

    const PAGES_PER_TYPE = 5;

    let totalInserted = 0;
    let totalFailed = 0;

    const fetchers = [
        { name: 'Popular', fn: fetchPopularMovies },
        { name: 'Top Rated', fn: fetchTopRatedMovies }
    ];

    for (const fetcher of fetchers) {
        console.log(`\n🎬 Category: ${fetcher.name}`);

        for (let page = 1; page <= PAGES_PER_TYPE; page++) {
            console.log(`\n📥 Fetching ${fetcher.name} Page ${page}...`);
            try {
                const movies = await fetcher.fn(page);
                console.log(`   Found ${movies.length} movies.`);

                const moviesToInsert: any[] = [];

                for (const movie of movies) {
                    if (!movie.description) continue;

                    try {
                        // IMPROVED ACCURACY: Embed title and genres along with overview
                        const genresList = Array.isArray(movie.genres) ? movie.genres.join(', ') : 'None';
                        const textToEmbed = `${movie.title}. Genres: ${genresList}. Overview: ${movie.description}`;

                        const { embedding } = await getEmbedding(textToEmbed);

                        moviesToInsert.push({
                            id: movie.id,
                            title: movie.title,
                            overview: movie.description,
                            genres: movie.genres,
                            poster_url: movie.poster_url,
                            release_date: movie.release_date || null,
                            popularity: movie.popularity,
                            vote_average: movie.vote_average,
                            embedding
                        });

                        process.stdout.write('.');
                        await new Promise(r => setTimeout(r, 2200));

                    } catch (err: any) {
                        console.error(`\n   ❌ Failed embedding for "${movie.title}": ${err.message}`);
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
    }

    console.log('\n✨ Enhanced Seeding Complete!');
    console.log(`📊 Total Upserted/Updated: ${totalInserted}`);
    console.log(`⚠️ Total Failed Embeddings: ${totalFailed}`);
}

seedEnhanced().catch(console.error);
