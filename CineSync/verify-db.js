require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Note: using Service Role key for verification to bypass RLS if any
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase configuration');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verify() {
    console.log('🔍 Verifying Database State...');

    // 1. Check if movies exist
    const { data: movies, error } = await supabase
        .from('movies')
        .select('id, title, genres, embedding')
        .limit(1);

    if (error) {
        console.error('❌ Error fetching movies:', error.message);
        return;
    }

    if (!movies || movies.length === 0) {
        console.error('❌ No movies found in database! Seed script might have failed silently or not run.');
        return;
    }

    const movie = movies[0];
    console.log(`✅ Found movie: "${movie.title}"`);

    // 2. Check embedding dimensions
    if (!movie.embedding) {
        console.error('❌ Movie has no embedding!');
        return;
    }

    // supabase-js might return embedding as string or array depending on version/config
    let embeddingDim = 0;
    if (Array.isArray(movie.embedding)) {
        embeddingDim = movie.embedding.length;
    } else if (typeof movie.embedding === 'string') {
        // parse string vector "[1,2,3...]"
        try {
            const parsed = JSON.parse(movie.embedding);
            embeddingDim = parsed.length;
        } catch (e) {
            console.log('Could not parse embedding string:', movie.embedding.substring(0, 20) + '...');
        }
    }

    console.log(`✅ Embedding dimensions in DB: ${embeddingDim}`);

    if (embeddingDim !== 768) {
        console.warn(`WARNING: Expected 768 dimensions (Gemini), found ${embeddingDim}. Schema mismatch?`);
    }

    // 3. Test Search RPC
    console.log('\n🔄 Testing Search RPC...');
    const geminiKey = process.env.GEMIN_API_KEY || process.env.GEMINI_API_KEY;
    if (!geminiKey) {
        console.error('❌ Missing GEMINI_API_KEY');
        return;
    }

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent('Happy movies');
    const queryEmbedding = result.embedding.values;

    console.log(`✅ Generated query embedding: ${queryEmbedding.length} dims`);

    const { data: searchResults, error: searchError } = await supabase.rpc(
        'search_movies_by_embedding',
        {
            query_embedding: queryEmbedding,
            similarity_threshold: 0.1,
            match_count: 5,
        }
    );

    if (searchError) {
        console.error('❌ RPC Search failed:', searchError.message);
        console.error('   Hint: Arguments might be mismatching function signature (e.g. dimensions)');
    } else {
        console.log(`✅ Search successful! Found ${searchResults.length} matches.`);
        if (searchResults.length > 0) {
            console.log('   Top match:', searchResults[0].title, `(sim: ${searchResults[0].similarity.toFixed(4)})`);
        } else {
            console.warn('   ⚠️ No matches found even with 0.1 threshold.');
        }
    }
}

verify();
