require('dotenv').config({ path: '.env.local' });

console.log('Checking Environment Variables:');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ PRESENT' : '❌ MISSING');
console.log('GEMIN_API_KEY:', process.env.GEMIN_API_KEY ? '✅ PRESENT' : '❌ MISSING');
