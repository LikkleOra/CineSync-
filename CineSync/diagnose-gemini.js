#!/usr/bin/env node

/**
 * 🔍 Comprehensive Gemini API Diagnostics
 * 
 * This script performs deep diagnostics on the Gemini API key configuration
 * and helps identify why the API key is not working.
 */

require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║     🔍 GEMINI API KEY DIAGNOSTIC REPORT                    ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// ============================================================================
// SECTION 1: Environment Variable Check
// ============================================================================

console.log('📋 SECTION 1: Environment Variable Check');
console.log('─'.repeat(60));

const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

console.log(`✓ .env.local exists: ${envExists ? '✅ Yes' : '❌ No'}`);

if (envExists) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const hasGeminiKey = envContent.includes('GEMINI_API_KEY');
    console.log(`✓ Contains GEMINI_API_KEY: ${hasGeminiKey ? '✅ Yes' : '❌ No'}`);
}

const apiKey = process.env.GEMINI_API_KEY;
console.log(`✓ GEMINI_API_KEY loaded: ${apiKey ? '✅ Yes' : '❌ No'}`);

if (apiKey) {
    console.log(`✓ Key length: ${apiKey.length} characters`);
    console.log(`✓ Key format: ${apiKey.startsWith('AIza') ? '✅ Valid prefix (AIza)' : '❌ Invalid prefix'}`);
    console.log(`✓ Key preview: ${apiKey.substring(0, 20)}...${apiKey.substring(apiKey.length - 10)}`);
} else {
    console.log('❌ GEMINI_API_KEY is undefined or empty!');
}

console.log('\n');

// ============================================================================
// SECTION 2: API Key Validation
// ============================================================================

console.log('🔐 SECTION 2: API Key Validation');
console.log('─'.repeat(60));

if (!apiKey) {
    console.log('❌ Cannot proceed: GEMINI_API_KEY not found');
    console.log('\n📝 Fix: Add GEMINI_API_KEY to .env.local');
    console.log('   Get a key from: https://makersuite.google.com/app/apikey\n');
    process.exit(1);
}

// ============================================================================
// SECTION 3: Direct API Test
// ============================================================================

console.log('🧪 SECTION 3: Direct API Test');
console.log('─'.repeat(60));

async function testAPI() {
    try {
        console.log('⏳ Initializing GoogleGenerativeAI...');
        const genAI = new GoogleGenerativeAI(apiKey);
        
        console.log('⏳ Getting model (text-embedding-004)...');
        const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
        
        console.log('⏳ Calling embedContent with test text...');
        const result = await model.embedContent('test embedding');
        
        const embedding = result.embedding.values;
        
        console.log('✅ API Call Successful!');
        console.log(`   • Embedding dimensions: ${embedding.length}`);
        console.log(`   • Sample values: [${embedding.slice(0, 3).map(v => v.toFixed(4)).join(', ')}]`);
        console.log(`   • Min value: ${Math.min(...embedding).toFixed(4)}`);
        console.log(`   • Max value: ${Math.max(...embedding).toFixed(4)}`);
        
        return true;
    } catch (error) {
        console.log('❌ API Call Failed!');
        console.log(`\n📌 Error Details:`);
        console.log(`   • Message: ${error.message}`);
        
        if (error.status) {
            console.log(`   • HTTP Status: ${error.status}`);
        }
        
        if (error.error) {
            console.log(`   • Error Object: ${JSON.stringify(error.error, null, 2)}`);
        }
        
        // Provide specific guidance based on error
        if (error.message.includes('API key not valid')) {
            console.log(`\n🔧 Troubleshooting:`);
            console.log(`   1. The API key may be expired or revoked`);
            console.log(`   2. The API key may not have Generative Language API enabled`);
            console.log(`   3. The API key may be from a different project`);
            console.log(`\n📝 Solution:`);
            console.log(`   • Get a new key: https://makersuite.google.com/app/apikey`);
            console.log(`   • Or use Google Cloud: https://console.cloud.google.com`);
        } else if (error.message.includes('fetch failed')) {
            console.log(`\n🔧 Troubleshooting:`);
            console.log(`   • Network connectivity issue`);
            console.log(`   • Check your internet connection`);
            console.log(`   • Check if Google APIs are accessible from your network`);
        } else if (error.message.includes('401') || error.message.includes('403')) {
            console.log(`\n🔧 Troubleshooting:`);
            console.log(`   • Authentication failed`);
            console.log(`   • API key may be invalid or expired`);
        }
        
        return false;
    }
}

// ============================================================================
// SECTION 4: Environment Context
// ============================================================================

async function showEnvironmentContext() {
    console.log('\n\n📊 SECTION 4: Environment Context');
    console.log('─'.repeat(60));
    
    console.log(`✓ Node.js version: ${process.version}`);
    console.log(`✓ Platform: ${process.platform}`);
    console.log(`✓ Current directory: ${process.cwd()}`);
    console.log(`✓ NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
    
    // Check for other API keys
    const otherKeys = {
        'TMDB_API_KEY': process.env.TMDB_API_KEY ? '✅ Set' : '❌ Not set',
        'OMDB_KEY': process.env.OMDB_KEY ? '✅ Set' : '❌ Not set',
        'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Not set',
        'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not set',
    };
    
    console.log('\n✓ Other environment variables:');
    Object.entries(otherKeys).forEach(([key, status]) => {
        console.log(`   • ${key}: ${status}`);
    });
}

// ============================================================================
// SECTION 5: Recommendations
// ============================================================================

async function showRecommendations(apiWorking) {
    console.log('\n\n💡 SECTION 5: Recommendations');
    console.log('─'.repeat(60));
    
    if (apiWorking) {
        console.log('✅ Your Gemini API key is working correctly!');
        console.log('\n📝 Next steps:');
        console.log('   1. Restart your development server: npm run dev');
        console.log('   2. Test the embedding endpoint: POST /api/embedding');
        console.log('   3. Run the full test suite: npm test');
    } else {
        console.log('❌ Your Gemini API key is not working.');
        console.log('\n📝 Action items:');
        console.log('   1. Get a new API key:');
        console.log('      • Visit: https://makersuite.google.com/app/apikey');
        console.log('      • Click "Create API Key"');
        console.log('      • Copy the generated key');
        console.log('   2. Update .env.local:');
        console.log('      • Replace GEMINI_API_KEY with the new key');
        console.log('      • Save the file');
        console.log('   3. Restart your development server:');
        console.log('      • Stop: Ctrl+C');
        console.log('      • Start: npm run dev');
        console.log('   4. Re-run this diagnostic:');
        console.log('      • node diagnose-gemini.js');
    }
}

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
    const apiWorking = await testAPI();
    await showEnvironmentContext();
    await showRecommendations(apiWorking);
    
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║     📊 Diagnostic Complete                                 ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    
    process.exit(apiWorking ? 0 : 1);
}

main().catch(error => {
    console.error('❌ Diagnostic failed:', error);
    process.exit(1);
});
