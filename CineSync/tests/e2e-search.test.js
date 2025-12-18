const assert = require('assert');

async function testSearchFlow() {
    console.log('🧪 Testing Search API Flow...');

    try {
        // 1. Get Embedding
        const embedRes = await fetch('http://localhost:3000/api/embedding', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: 'adventure movie' })
        });

        if (embedRes.status !== 200) {
            throw new Error(`Embedding API returned ${embedRes.status}: ${JSON.stringify(embedData)}`);
        }

        const embedding = embedData.embedding;
        assert(Array.isArray(embedding), 'Embedding should be an array');

        // 2. Search
        const searchRes = await fetch('http://localhost:3000/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                embedding,
                selectedGenres: ['Action'] // Test case-insensitivity
            })
        });

        if (searchRes.status !== 200) {
            throw new Error(`Search API returned ${searchRes.status}`);
        }

        const searchData = await searchRes.json();

        assert(Array.isArray(searchData.movies), 'Movies should be an array');

        // Warn if empty, but don't fail as DB might be empty initially
        if (searchData.movies.length === 0) {
            console.warn('⚠️ No movies found (DB might be empty) but API contract held');
        } else {
            const firstMovie = searchData.movies[0];
            // TMDb descriptions can be empty string in rare cases, check for existence of field or content
            assert(firstMovie.description !== undefined, 'Movie should have description field');
            console.log(`✅ Found ${searchData.movies.length} movies`);
        }

        console.log('✅ Search API Test Passed');

    } catch (error) {
        console.error('❌ Search Test Failed:', error.message);
        process.exit(1);
    }
}

testSearchFlow();
