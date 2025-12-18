const assert = require('assert');

async function testEmbedding() {
    console.log('🧪 Testing Embedding API...');

    try {
        const response = await fetch('http://localhost:3000/api/embedding', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: 'test query' })
        });

        if (response.status !== 200) {
            throw new Error(`Expected status 200, got ${response.status}`);
        }

        const data = await response.json();

        assert(Array.isArray(data.embedding), 'Embedding should be an array');
        assert.strictEqual(data.dimensions, 768, 'Dimensions should be 768');
        assert(data.embedding.length > 0, 'Embedding should not be empty');

        console.log('✅ Embedding API Test Passed');
    } catch (error) {
        console.error('❌ Embedding API Test Failed:', error.message);
        process.exit(1);
    }
}

testEmbedding();
