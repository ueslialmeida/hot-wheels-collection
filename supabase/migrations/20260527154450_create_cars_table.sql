create table IF not exists public.cars (
  id uuid not null default gen_random_uuid (),
  model_name text not null,
  model_code text null,
  in_year_collection_number text null,
  in_series_collection_number text null,
  color text null,
  image_url text null,
  series_title text null,
  created_at timestamp with time zone null default now(),
  user_id uuid not null default auth.uid (),
  collection_year integer null,
  constraint cars_pkey primary key (id),
  constraint cars_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_cars_model_code on public.cars using btree (model_code) TABLESPACE pg_default;