import { NextRequest, NextResponse } from 'next/server';
import { getEmbedding } from '@/lib/server/embedding';

export async function POST(request: NextRequest) {
    // Optional: Check method if not handled by Next.js app router automatically (it usually is)

    try {
        const body = await request.json();
        const { text } = body;

        console.log('🔍 Generating embedding for text length:', text?.length);

        const result = await getEmbedding(text);

        return NextResponse.json(result);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const isRateLimit = errorMessage.includes('Rate limit exceeded');
        const isClientError = errorMessage.includes('Input text') || errorMessage.includes('required');

        console.error('❌ Embedding API error:', errorMessage);

        return NextResponse.json(
            { error: errorMessage },
            { status: isRateLimit ? 429 : (isClientError ? 400 : 500) }
        );
    }
}
