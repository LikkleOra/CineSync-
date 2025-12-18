const http = require('http');

function postRequest(path, body) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(data) });
                } catch (e) {
                    resolve({ status: res.statusCode, body: data });
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(body);
        req.end();
    });
}

async function runTest() {
    console.log('🧪 Starting E2E API Test...');

    // 1. Test Embedding
    console.log('\n1️⃣ Testing /api/embedding...');
    try {
        const embRes = await postRequest('/api/embedding', JSON.stringify({ text: "uplifting space adventure" }));

        if (embRes.status !== 200) {
            console.error('❌ Embedding failed:', embRes.status, embRes.body);
            process.exit(1);
        }

        const embedding = embRes.body.embedding;
        const dimensions = embRes.body.dimensions; // or calculate length

        if (!embedding || !Array.isArray(embedding)) {
            console.error('❌ No embedding returned');
            process.exit(1);
        }

        console.log(`✅ Embedding received. dims=${dimensions || embedding.length}`);

        // 2. Test Search
        console.log('\n2️⃣ Testing /api/search...');
        const searchRes = await postRequest('/api/search', JSON.stringify({
            embedding: embedding,
            selectedGenres: ["Action"] // Test case-insensitive
        }));

        if (searchRes.status !== 200) {
            console.error('❌ Search failed:', searchRes.status, searchRes.body);
            process.exit(1);
        }

        const movies = searchRes.body.movies;
        console.log(`✅ Search successful. Found ${movies?.length || 0} movies.`);

        if (movies?.length > 0) {
            console.log('   Sample:', movies[0].title);
        } else {
            console.warn('   ⚠️ No movies found (check seeding)');
        }

    } catch (e) {
        console.error('❌ Test failed with exception:', e.message);
        process.exit(1);
    }
}

// Wait a bit for Next.js to compile
setTimeout(runTest, 10000);
