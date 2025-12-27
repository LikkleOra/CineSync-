require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

console.log('🔍 Testing Supabase Connection\n');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('📋 Environment Check:');
console.log('  NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
console.log('  SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing');

if (!supabaseUrl || !supabaseAnonKey) {
    console.log('\n❌ Missing required Supabase environment variables');
    process.exit(1);
}

console.log('\n📝 Supabase URL:', supabaseUrl.substring(0, 30) + '...');

async function testConnection() {
    try {
        console.log('\n🔄 Testing connection with Anon Key...');
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // Try to ping the database
        const { data, error } = await supabase
            .from('movies')
            .select('id')
            .limit(1);

        if (error) {
            console.log('❌ Connection failed:', error.message);
            console.log('Error details:', error);
            return false;
        }

        console.log('✅ Connection successful!');
        console.log('📊 Test query returned:', data ? data.length : 0, 'rows');

        // Test the RPC function
        console.log('\n🔄 Testing RPC function...');
        const testEmbedding = new Array(768).fill(0.1);
        const { data: rpcData, error: rpcError } = await supabase.rpc(
            'search_movies_by_embedding',
            {
                query_embedding: testEmbedding,
                similarity_threshold: 0.1,
                match_count: 5,
            }
        );

        if (rpcError) {
            console.log('❌ RPC failed:', rpcError.message);
            console.log('Error details:', rpcError);
            return false;
        }

        console.log('✅ RPC function works!');
        console.log('📊 Found', rpcData ? rpcData.length : 0, 'movies');

        return true;
    } catch (err) {
        console.log('❌ Test failed:', err.message);
        console.log('Full error:', err);
        return false;
    }
}

testConnection();
