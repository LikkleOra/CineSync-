const https = require('https');

console.log('Testing general internet connectivity...');

https.get('https://www.google.com', (res) => {
    console.log('✅ Connected to Google (Status:', res.statusCode, ')');
    res.resume(); // Consume data to prevent hanging
}).on('error', (e) => {
    console.error('❌ Failed to connect to Google:', e.message);
});
