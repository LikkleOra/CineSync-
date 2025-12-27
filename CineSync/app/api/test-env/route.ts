import { NextResponse } from 'next/server';

export async function GET() {
    const geminiKey = process.env.GEMINI_API_KEY;

    return NextResponse.json({
        hasGeminiKey: !!geminiKey,
        keyLength: geminiKey?.length || 0,
        keyPrefix: geminiKey?.substring(0, 10) || 'N/A',
        nodeEnv: process.env.NODE_ENV,
        allEnvKeys: Object.keys(process.env).filter(k =>
            k.includes('GEMINI') || k.includes('GOOGLE') || k.includes('API')
        )
    });
}
