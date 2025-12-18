require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const { GoogleGenerativeAI } = require('@google/generative-ai');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Using Gemini API Key
const geminiApiKey = process.env.GEMINI_API_KEY;

console.log('🔍 CineSync Search Flow Test\n');
console.log('Environment Check:');
console.log('✓ Supabase URL:', supabaseUrl ? '✅ Set' : '❌ NOT SET');
console.log('✓ Supabase Key:', supabaseKey ? '✅ Set' : '❌ NOT SET');
console.log('✓ Gemini Key:', geminiApiKey ? '✅ Set' : '❌ NOT SET');

async function generateEmbedding(text) {
    console.log('\n📝 Generating embedding for:', text);

    if (!geminiApiKey) {
        throw new Error('Gemini API Key is missing');
    }

    try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

        const result = await model.embedContent(text);
        const embedding = result.embedding.values;

        console.log('✅ Embedding generated:', embedding.length, 'dimensions');
        return embedding;
    } catch (error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
}

async function searchMovies(queryEmbedding) {
    console.log('\n🔎 Searching database...');

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.rpc(
        'search_movies_by_embedding',
        {
            query_embedding: queryEmbedding,
            similarity_threshold: 0.1,
            match_count: 10,
        }
    );

    if (error) {
        throw new Error(`Database Error: ${error.message}`);
    }

    console.log('✅ Found', data.length, 'movies');
    return data;
}

async function testSearchFlow() {
    try {
        // Test query
        const searchQuery = 'happy mood action';

        // Step 1: Generate embedding
        const embedding = await generateEmbedding(searchQuery);

        // Step 2: Search database
        const movies = await searchMovies(embedding);

        // Step 3: Display results
        console.log('\n📊 Search Results:');
        movies.slice(0, 3).forEach((movie, idx) => {
            console.log(`\n${idx + 1}. ${movie.title} (${movie.release_date?.substring(0, 4)})`);
            console.log(`   Rating: ${movie.vote_average}`);
            console.log(`   Genres: ${movie.genres?.join(', ')}`);
            console.log(`   Similarity: ${movie.similarity}`);
        });

        console.log('\n✅ Complete search flow successful!');

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        process.exit(1);
    }
}

testSearchFlow();
