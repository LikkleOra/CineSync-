import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
    console.log('🔍 Embedding API called');

    try {
        const body = await request.json();
        const { text } = body;

        // Validate input
        if (!text || typeof text !== 'string' || !text.trim()) {
            console.log('❌ Invalid text input');
            return NextResponse.json(
                { error: 'Text is required and must be a non-empty string' },
                { status: 400 }
            );
        }

        // Get Gemini API key
        const apiKey = process.env.GEMINI_API_KEY || process.env.GEMIN_API_KEY;

        if (!apiKey) {
            console.error('❌ Gemini API key is not set');
            return NextResponse.json(
                { error: 'Server configuration error: Gemini API key not configured' },
                { status: 500 }
            );
        }

        console.log('✅ Gemini API key is set');
        console.log('🔄 Calling Gemini API for embedding...');

        // Call Gemini API
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

        const result = await model.embedContent(text.trim());
        const embedding = result.embedding.values;

        if (!embedding || embedding.length === 0) {
            throw new Error('Empty embedding returned from Gemini API');
        }

        console.log('✅ Gemini embedding generated:', embedding.length, 'dimensions');

        return NextResponse.json({
            embedding,
            dimensions: embedding.length,
        });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ Embedding API error:', errorMessage);
        return NextResponse.json(
            { error: `Failed to generate embedding: ${errorMessage}` },
            { status: 500 }
        );
    }
}
