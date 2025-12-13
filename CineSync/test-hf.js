require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.HUGGINGFACE_API_KEY;
const text = "This is a test sentence.";

async function testEndpoint(url, payload, label) {
    console.log(`\nTesting ${label}: ${url}`);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        console.log(`Status: ${response.status} ${response.statusText}`);
        const text = await response.text();
        try {
            const json = JSON.parse(text);
            console.log('Response (JSON):', JSON.stringify(json).substring(0, 100) + '...');
        } catch (e) {
            console.log('Response (Text):', text.substring(0, 100) + '...');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function run() {
    // 1. Explicit pipeline?
    await testEndpoint(
        'https://router.huggingface.co/hf-inference/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2',
        { inputs: text, options: { wait_for_model: true } },
        'Router Pipeline URL'
    );

    // 2. Different model (BAAI/bge-small-en-v1.5)
    await testEndpoint(
        'https://router.huggingface.co/hf-inference/models/BAAI/bge-small-en-v1.5',
        { inputs: text, options: { wait_for_model: true } },
        'Router BAAI Model'
    );
}

run();
