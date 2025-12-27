import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ status: '❌ Key Missing' });
    }

    // Check for common formatting issues
    const checks = {
        length: apiKey.length,
        startsWithAI: apiKey.startsWith('AI'),
        hasQuotes: apiKey.startsWith('"') || apiKey.startsWith("'") || apiKey.endsWith('"') || apiKey.endsWith("'"),
        hasWhitespace: apiKey.trim() !== apiKey,
    };

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

        // Attempt a real call
        await model.embedContent('test');

        return NextResponse.json({
            status: '✅ Working',
            keyChecks: checks
        });
    } catch (error: any) {
        return NextResponse.json({
            status: '❌ Failed',
            keyChecks: checks,
            errorMessage: error.message,
            errorDetails: error,
            env: process.env.NODE_ENV
        });
    }
}
