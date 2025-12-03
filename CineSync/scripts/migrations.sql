-- CineSync Database Migrations
-- Run these in Supabase SQL Editor

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create movies table
CREATE TABLE IF NOT EXISTS movies (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  genres TEXT[] NOT NULL DEFAULT '{}',
  description TEXT NOT NULL,
  poster_url TEXT,
  embedding vector(384) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create index for similarity search
CREATE INDEX IF NOT EXISTS movies_embedding_idx 
ON movies USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- 4. Create search function
CREATE OR REPLACE FUNCTION search_movies_by_embedding(
  query_embedding vector(384),
  similarity_threshold float DEFAULT 0.1,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id TEXT,
  title TEXT,
  genres TEXT[],
  description TEXT,
  poster_url TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    m.title,
    m.genres,
    m.description,
    m.poster_url,
    (1 - (m.embedding <=> query_embedding) / 2)::FLOAT AS similarity
  FROM movies m
  WHERE (1 - (m.embedding <=> query_embedding) / 2) >= similarity_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

-- 5. Create timestamp update trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_movies_updated_at ON movies;
CREATE TRIGGER update_movies_updated_at
BEFORE UPDATE ON movies
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 6. Enable Row Level Security
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;

-- 7. Create public read policy
CREATE POLICY "Allow public read access" ON movies
FOR SELECT USING (true);

-- Done! Your database is ready for CineSync
