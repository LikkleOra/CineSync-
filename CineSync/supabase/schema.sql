-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create the movies table
create table movies (
  id bigint primary key,
  title text not null,
  overview text,
  genre_ids integer[], -- Storing as array of integers if needed, or we can use text[] for names
  genres text[],       -- The app currently uses text[] for genre names
  poster_url text,
  release_date date,
  popularity float,
  embedding vector(384), -- all-MiniLM-L6-v2 outputs 384 dimensions
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a function to search for movies by embedding similarity
create or replace function search_movies_by_embedding(
  query_embedding vector(384),
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
    1 - (movies.embedding <=> query_embedding) as similarity
  from movies
  where 1 - (movies.embedding <=> query_embedding) > similarity_threshold
  order by similarity desc
  limit match_count;
end;
$$;
