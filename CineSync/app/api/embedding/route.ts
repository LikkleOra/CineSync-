import { NextRequest, NextResponse } from 'next/server';
import { getEmbedding } from '@/lib/server/embedding';

export async function POST(request: NextRequest) {
    // Optional: Check method if not handled by Next.js app router automatically (it usually is)

    try {
        const body = await request.json();
        const { text } = body;

        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return NextResponse.json(
                { error: 'Missing or empty "text" parameter.' },
                { status: 400 }
            );
        }

        console.log('🔍 Generating embedding for text length:', text.length);

        const result = await getEmbedding(text);
        return NextResponse.json(result);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        console.error('❌ Embedding API error:', errorMessage);

        // Map status codes based on error message content
        let status = 500;
        if (errorMessage.includes('Rate limit')) status = 429;
        if (errorMessage.includes('not configured')) status = 500;
        if (errorMessage.includes('Input text') || errorMessage.includes('maximum length')) status = 400;

        return NextResponse.json(
            { error: errorMessage },
            { status }
        );
    }
}
