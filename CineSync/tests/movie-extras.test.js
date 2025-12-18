const http = require('http');

async function testExtrasAPI(movieId) {
    console.log(`🧪 Testing /api/movies/${movieId}/extras...`);

    return new Promise((resolve, reject) => {
        const timeout = 10000;
        const req = http.get(`http://localhost:3000/api/movies/${movieId}/extras`, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    console.error(`❌ API Failed with status ${res.statusCode}:`, data);
                    reject(new Error(`Status ${res.statusCode}`));
                    return;
                }

                try {
                    const json = JSON.parse(data);
                    console.log('✅ API Success! Response data:');
                    console.log(`   - Tagline: ${json.tagline}`);
                    console.log(`   - Runtime: ${json.runtime} mins`);
                    console.log(`   - Trailer: ${json.trailer ? json.trailer.key : 'N/A'}`);
                    console.log(`   - Provider Count: ${json.providers ? Object.keys(json.providers).length : 0} categories`);
                    resolve(json);
                } catch (e) {
                    console.error('❌ Failed to parse JSON:', e.message);
                    reject(e);
                }
            });
        });

        req.setTimeout(timeout, () => {
            req.destroy();
            reject(new Error(`Request timed out after ${timeout}ms`));
        });

        req.on('error', (e) => {
            console.error('❌ Network Error:', e.message);
            reject(e);
        });
    });
}

// Test with "The Matrix" (ID: 603)
testExtrasAPI(603).catch(() => process.exit(1));
