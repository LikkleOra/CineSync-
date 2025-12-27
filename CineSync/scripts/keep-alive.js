require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function keepAlive() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    console.log('Sending keep-alive ping to Supabase...');

    const { data, error } = await supabase
        .from('movies')
        .select('id')
        .limit(1);

    if (error) {
        console.error('Ping failed:', error.message);
        process.exit(1);
    }

    console.log('Successfully pinged Supabase. Project will stay active!');
}

keepAlive();
