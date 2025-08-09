create or replace function search_movies_by_embedding(
  query_embedding vector(384),
  similarity_threshold float default 0.1,
  match_count int default 10,
  genre_filter text[] default null
)
returns table (
  id text,
  title text,
  genres text[],
  description text,
  poster_url text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    m.id,
    m.title,
    m.genres,
    m.description,
    m.poster_url,
    1 - (m.embedding <=> query_embedding) as similarity
  from movies m
  where
    m.embedding <=> query_embedding < similarity_threshold and
    (genre_filter is null or m.genres && genre_filter)
  order by similarity desc
  limit match_count;
end;
$$;
