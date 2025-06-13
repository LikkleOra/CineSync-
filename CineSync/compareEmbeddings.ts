export function cosineSimilarity(vec1: number[], vec2: number[]): number {
  const dotProduct = vec1.reduce((sum, value, index) => sum + value * vec2[index], 0)
  const magnitude1 = Math.sqrt(vec1.reduce((sum, value) => sum + value * value, 0))
  const magnitude2 = Math.sqrt(vec2.reduce((sum, value) => sum + value * value, 0))
  return dotProduct / (magnitude1 * magnitude2)
}

export function findSimilarMovies(
  queryEmbedding: number[],
  movies: { id: string; embedding: number[] }[],
  threshold: number = 0.1,
  limit: number = 10
): { id: string; similarity: number }[] {
  const similarities = movies.map(movie => ({
    id: movie.id,
    similarity: cosineSimilarity(queryEmbedding, movie.embedding)
  }))

  return similarities
    .filter(sim => sim.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
}
