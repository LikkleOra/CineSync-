export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey) {
    throw new Error('HUGGINGFACE_API_KEY is not configured');
  }

  if (!text || text.trim().length === 0) {
    throw new Error('Text input cannot be empty');
  }

  try {
    const response = await fetch(
      'https://router.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: text,
          options: {
            wait_for_model: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Hugging Face API error: ${error.error || response.statusText}`);
    }

    const data = await response.json();

    // Hugging Face returns array of embeddings for batch input
    // For single input, it returns [[...embedding...]]
    let embedding: number[];

    if (Array.isArray(data) && Array.isArray(data[0])) {
      embedding = data[0];
    } else if (Array.isArray(data)) {
      embedding = data;
    } else {
      throw new Error('Unexpected response format from Hugging Face API');
    }

    // Validate embedding length (all-MiniLM-L6-v2 outputs 384 dimensions)
    if (!Array.isArray(embedding) || embedding.length !== 384) {
      throw new Error(
        `Invalid embedding dimensions: expected 384, got ${embedding.length}`
      );
    }

    // Validate all values are numbers
    if (!embedding.every((val) => typeof val === 'number')) {
      throw new Error('Embedding contains non-numeric values');
    }

    return embedding;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate embedding: ${error.message}`);
    }
    throw error;
  }
}

export async function generateMovieEmbeddings(
  movies: Array<{ id: string; description: string }>
): Promise<Array<{ id: string; embedding: number[] }>> {
  const results = await Promise.allSettled(
    movies.map(async (movie) => {
      const embedding = await generateEmbedding(movie.description);
      return { id: movie.id, embedding };
    })
  );

  const embeddings: Array<{ id: string; embedding: number[] }> = [];
  const errors: Array<{ id: string; error: string }> = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      embeddings.push(result.value);
    } else {
      errors.push({
        id: movies[index].id,
        error: result.reason?.message || 'Unknown error',
      });
    }
  });

  if (errors.length > 0) {
    console.warn(`Failed to generate embeddings for ${errors.length} movies:`, errors);
  }

  return embeddings;
}
