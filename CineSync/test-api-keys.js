require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

console.log('🔍 API Key Validation Test\n');

// Test Gemini API
async function testGeminiAPI() {
    // Support GEMINI_API_KEY (preferred) and GEMIN_API_KEY (legacy/typo)
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    console.log('═══ GEMINI API ═══');
    console.log('Key exists:', apiKey ? '✅ Yes' : '❌ No');

    if (!apiKey) {
        console.log('Status: ❌ API key not found in .env.local');
        console.log('Expected: GEMINI_API_KEY');
        return false;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

        const result = await model.embedContent('test text for embedding');
        const embedding = result.embedding.values;

        console.log('Status: ✅ Working');
        console.log('Embedding dimensions:', embedding.length);
        console.log('Sample values:', embedding.slice(0, 3).map(v => v.toFixed(4)));
        return true;
    } catch (error) {
        console.log('Status: ❌ Error');
        console.log('Error:', error.message);
        return false;
    }
}

// Test OMDb API
async function testOMDbAPI() {
    const apiKey = process.env.OMDB_KEY;

    console.log('\n═══ OMDB API ═══');
    console.log('Key exists:', apiKey ? '✅ Yes' : '❌ No');

    if (!apiKey) {
        console.log('Status: ❌ API key not found');
        return false;
    }

    try {
        const response = await axios.get('https://www.omdbapi.com/', {
            params: { apikey: apiKey, t: 'Inception', y: '2010' }
        });

        if (response.data.Response === 'True') {
            console.log('Status: ✅ Working');
            console.log('Test movie:', response.data.Title, `(${response.data.Year})`);
            return true;
        } else {
            console.log('Status: ❌', response.data.Error);
            return false;
        }
    } catch (error) {
        console.log('Status: ❌ Error:', error.message);
        return false;
    }
}

// Test HuggingFace API
async function testHuggingFaceAPI() {
    const apiKey = process.env.HUGGINGFACE_API_KEY;

    console.log('\n═══ HUGGINGFACE API ═══');
    console.log('Key exists:', apiKey ? '✅ Yes' : '❌ No');

    if (!apiKey) {
        console.log('Status: ⚠️ Not configured (optional)');
        return true;
    }

    try {
        const response = await fetch(
            'https://router.huggingface.co/hf-inference/models/BAAI/bge-small-en-v1.5',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inputs: 'test', options: { wait_for_model: true } }),
            }
        );

        if (response.ok) {
            console.log('Status: ✅ Working');
            return true;
        } else {
            console.log('Status: ❌ HTTP', response.status);
            return false;
        }
    } catch (error) {
        console.log('Status: ❌ Error:', error.message);
        return false;
    }
}

async function runTests() {
    const geminiOk = await testGeminiAPI();
    const omdbOk = await testOMDbAPI();
    await testHuggingFaceAPI();

    console.log('\n═══ SUMMARY ═══');
    if (geminiOk && omdbOk) {
        console.log('🎉 All APIs are working!');
    } else {
        if (!geminiOk) console.log('❌ Fix Gemini: add GEMINI_API_KEY to .env.local');
        if (!omdbOk) console.log('❌ Fix OMDb: add OMDB_KEY to .env.local');
    }
}

runTests();
