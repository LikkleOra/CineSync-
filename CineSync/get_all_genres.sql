create or replace function get_all_genres()
returns table (
  genre text
)
language plpgsql
as $$
begin
  return query
  select distinct unnest(genres) as genre from movies order by genre;
end;
$$;
