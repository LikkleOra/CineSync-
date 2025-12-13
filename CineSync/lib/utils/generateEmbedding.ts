import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Generate text embedding using Gemini API
 * Uses text-embedding-004 model (768 dimensions)
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  // Support both variable names
  const apiKey = process.env.GEMINI_API_KEY || process.env.GEMIN_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key is not configured (set GEMIN_API_KEY or GEMINI_API_KEY in .env.local)');
  }

  if (!text || text.trim().length === 0) {
    throw new Error('Text input cannot be empty');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

    const result = await model.embedContent(text.trim());
    const embedding = result.embedding.values;

    if (!embedding || embedding.length === 0) {
      throw new Error('Empty embedding returned from Gemini API');
    }

    return embedding;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate embedding: ${error.message}`);
    }
    throw error;
  }
}
