// Quick test script to verify TMDB API key
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

console.log('=== TMDB API Key Check ===');
console.log('Key length:', apiKey ? apiKey.length : 'NOT SET');
console.log('Key preview:', apiKey ? `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}` : 'NOT SET');
console.log('Has quotes?', apiKey && (apiKey.startsWith('"') || apiKey.startsWith("'")));
console.log('Has spaces?', apiKey && apiKey.includes(' '));

// Test the API
if (apiKey) {
    console.log('\n=== Testing TMDB API ===');
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`)
        .then(res => {
            console.log('Status:', res.status);
            if (res.status === 200) {
                console.log('✅ API KEY WORKS!');
                return res.json();
            } else {
                console.log('❌ API KEY FAILED');
                return res.text();
            }
        })
        .then(data => {
            if (typeof data === 'string') {
                console.log('Error:', data);
            } else {
                console.log('Success! Fetched', data.results?.length || 0, 'movies');
            }
        })
        .catch(err => console.log('Error:', err.message));
} else {
    console.log('❌ No API key found!');
}
