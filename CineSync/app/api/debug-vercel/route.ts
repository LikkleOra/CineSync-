import { NextResponse } from 'next/server';

export async function GET() {
    const envVars = {
        GEMINI_API_KEY: process.env.GEMINI_API_KEY ? '✅ Present' : '❌ Missing',
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Present' : '❌ Missing',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Present' : '❌ Missing',
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Present' : '❌ Missing',
        TMDB_API_KEY: process.env.TMDB_API_KEY ? '✅ Present' : '❌ Missing',
        NODE_ENV: process.env.NODE_ENV,
    };

    // Safe exposure - show first 4 chars only if present
    const debugInfo = {
        config: envVars,
        details: {
            geminiLength: process.env.GEMINI_API_KEY?.length || 0,
            geminiPrefix: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 4) + '...' : 'N/A',
        }
    };

    return NextResponse.json(debugInfo);
}
