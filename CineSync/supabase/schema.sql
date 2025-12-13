-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Drop existing table and function to recreate with new dimensions
drop function if exists search_movies_by_embedding;
drop table if exists movies;

-- Create the movies table with 768-dimension embeddings for Gemini
create table movies (
  id bigint primary key,
  title text not null,
  overview text,
  genre_ids integer[],
  genres text[],
  poster_url text,
  release_date date,
  popularity float,
  vote_average float,
  embedding vector(768), -- Gemini text-embedding-004 outputs 768 dimensions
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a function to search for movies by embedding similarity
create or replace function search_movies_by_embedding(
  query_embedding vector(768),
  similarity_threshold float,
  match_count int
)
returns table (
  id bigint,
  title text,
  overview text,
  genres text[],
  poster_url text,
  release_date date,
  popularity float,
  vote_average float,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    movies.id,
    movies.title,
    movies.overview,
    movies.genres,
    movies.poster_url,
    movies.release_date,
    movies.popularity,
    movies.vote_average,
    1 - (movies.embedding <=> query_embedding) as similarity
  from movies
  where 1 - (movies.embedding <=> query_embedding) > similarity_threshold
  order by similarity desc
  limit match_count;
end;
$$;

-- Create index for faster similarity search
create index on movies using ivfflat (embedding vector_cosine_ops) with (lists = 100);
