require('dotenv').config({ path: '.env.local' });
const https = require('https');

console.log('🔍 Testing Supabase Connection with Different Methods\n');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Test 1: Direct HTTPS request
async function testHTTPS() {
    console.log('Test 1: Direct HTTPS GET request');
    const url = new URL(supabaseUrl);

    return new Promise((resolve) => {
        const options = {
            hostname: url.hostname,
            path: '/rest/v1/',
            method: 'GET',
            headers: {
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            },
            // Disable SSL verification temporarily for testing
            rejectUnauthorized: false
        };

        const req = https.request(options, (res) => {
            console.log('  Status:', res.statusCode);
            console.log('  ✅ HTTPS connection works!');
            resolve(true);
        });

        req.on('error', (err) => {
            console.log('  ❌ HTTPS failed:', err.message);
            console.log('  Error code:', err.code);
            resolve(false);
        });

        req.setTimeout(10000, () => {
            console.log('  ❌ Request timed out');
            req.destroy();
            resolve(false);
        });

        req.end();
    });
}

// Test 2: Using fetch with custom agent
async function testFetch() {
    console.log('\nTest 2: Fetch with custom agent');

    try {
        // For Node 18+, we can use native fetch
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
            headers: {
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            },
        });
        console.log('  Status:', response.status);
        console.log('  ✅ Fetch works!');
        return true;
    } catch (err) {
        console.log('  ❌ Fetch failed:', err.message);
        console.log('  Error cause:', err.cause?.message || 'Unknown');
        return false;
    }
}

// Test 3: Check network settings
async function checkNetworkSettings() {
    console.log('\nTest 3: Network Configuration');
    console.log('  Node version:', process.version);
    console.log('  Platform:', process.platform);
    console.log('  HTTP_PROXY:', process.env.HTTP_PROXY || 'Not set');
    console.log('  HTTPS_PROXY:', process.env.HTTPS_PROXY || 'Not set');
    console.log('  NODE_TLS_REJECT_UNAUTHORIZED:', process.env.NODE_TLS_REJECT_UNAUTHORIZED || 'Not set');
}

async function runTests() {
    await checkNetworkSettings();
    await testHTTPS();
    await testFetch();

    console.log('\n💡 Recommendations:');
    console.log('If all tests fail:');
    console.log('  1. Check your firewall/antivirus');
    console.log('  2. Disable VPN temporarily');
    console.log('  3. Try: set NODE_TLS_REJECT_UNAUTHORIZED=0 (temporary fix)');
    console.log('  4. Check if you\'re behind a corporate proxy');
}

runTests();
