import { GoogleGenerativeAI } from '@google/generative-ai';

// Simple in-memory rate limiter (token bucket) for this instance
// In a real serverless/edge env, use Redis/Upstash
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_MIN = 30;
const requesttimestamps: number[] = [];

function checkRateLimit(): boolean {
    const now = Date.now();
    // Remove timestamps older than window
    while (requesttimestamps.length > 0 && requesttimestamps[0] < now - RATE_LIMIT_WINDOW) {
        requesttimestamps.shift();
    }

    if (requesttimestamps.length >= MAX_REQUESTS_PER_MIN) {
        return false;
    }

    requesttimestamps.push(now);
    return true;
}

interface EmbeddingResult {
    embedding: number[];
    dimensions: number;
}

export async function getEmbedding(text: string): Promise<EmbeddingResult> {
    // 1. Input Validation
    if (!text || typeof text !== 'string') {
        throw new Error('Input text must be a non-empty string.');
    }

    const trimmed = text.trim();
    if (trimmed.length === 0) {
        throw new Error('Input text cannot be empty.');
    }

    if (trimmed.length > 2000) {
        throw new Error('Input text exceeds maximum length of 2000 characters.');
    }

    // 2. Rate Limiting (Server-side guard)
    if (!checkRateLimit()) {
        throw new Error('Rate limit exceeded. Please try again later.');
    }

    // 3. API Key Check
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not configured in environment variables.');
    }

    // 4. Call Provider with Retries
    let lastError: unknown;
    const maxRetries = 2; // 3 attempts total

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            if (attempt > 0) {
                // Exponential backoff: 500ms, 1000ms...
                await new Promise(r => setTimeout(r, 500 * Math.pow(2, attempt - 1)));
            }

            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

            const result = await model.embedContent(trimmed);
            const embedding = result.embedding.values;

            if (!embedding || embedding.length === 0) {
                throw new Error('Provider returned empty embedding.');
            }

            return {
                embedding,
                dimensions: embedding.length
            };

        } catch (error) {
            lastError = error;
            // If 429 or 5xx, retry. (Gemini throws structured errors, but simplified check here)
            const msg = error instanceof Error ? error.message : String(error);
            const isTransient = msg.includes('429') || msg.includes('500') || msg.includes('503') || msg.includes('fetch failed');

            if (!isTransient) {
                throw error; // Non-retryable
            }
            console.warn(`⚠️ Embedding attempt ${attempt + 1} failed: ${msg}. Retrying...`);
        }
    }

    throw lastError instanceof Error ? lastError : new Error('Failed to generate embedding after retries.');
}
