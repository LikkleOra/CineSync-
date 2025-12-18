require('dotenv').config({ path: '.env.local' });

console.log('🔍 Checking Environment Variables:');

const vars = [
    'GEMINI_API_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'TMDB_API_KEY'
];

let allPresent = true;

vars.forEach(v => {
    const isPresent = !!process.env[v];
    console.log(`${v}: ${isPresent ? '✅ PRESENT' : '❌ MISSING'}`);
    if (!isPresent) allPresent = false;
});

if (!allPresent) {
    console.log('\n⚠️ Some required variables are missing. Check your .env.local file.');
    process.exit(1);
} else {
    console.log('\n✨ All core variables detected!');
}
