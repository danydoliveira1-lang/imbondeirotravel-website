-- PROJECT IMBONDEIRO — PHASE 5.3 ADVANCED TOUR EDITOR
-- Additive migration only. Existing tour data is preserved.

alter table public.tours
  add column if not exists slug text,
  add column if not exists summary text,
  add column if not exists description text,
  add column if not exists category text,
  add column if not exists travel_style text,
  add column if not exists days integer,
  add column if not exists hero_image text,
  add column if not exists hero_video text,
  add column if not exists highlights jsonb default '[]'::jsonb,
  add column if not exists itinerary jsonb default '[]'::jsonb,
  add column if not exists inclusions jsonb default '[]'::jsonb,
  add column if not exists exclusions jsonb default '[]'::jsonb,
  add column if not exists practical_details text,
  add column if not exists sort_order integer default 0,
  add column if not exists featured boolean default false;

-- Create slugs for existing tours only when one is missing.
update public.tours
set slug = trim(
  both '-' from regexp_replace(
    lower(title),
    '[^a-z0-9]+',
    '-',
    'g'
  )
)
where slug is null or btrim(slug) = '';

-- Protect the public journey URL identifier.
create unique index if not exists tours_slug_unique_idx
  on public.tours (slug)
  where slug is not null;

-- Ensure structured Tour Editor fields contain arrays.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'tours_highlights_array'
  ) then
    alter table public.tours
      add constraint tours_highlights_array
      check (jsonb_typeof(highlights) = 'array');
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'tours_itinerary_array'
  ) then
    alter table public.tours
      add constraint tours_itinerary_array
      check (jsonb_typeof(itinerary) = 'array');
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'tours_inclusions_array'
  ) then
    alter table public.tours
      add constraint tours_inclusions_array
      check (jsonb_typeof(inclusions) = 'array');
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'tours_exclusions_array'
  ) then
    alter table public.tours
      add constraint tours_exclusions_array
      check (jsonb_typeof(exclusions) = 'array');
  end if;
end $$;

-- Phase 5.3 verification
select
  column_name,
  data_type,
  is_nullable,
  column_default
from information_schema.columns
where table_schema = 'public'
  and table_name = 'tours'
order by ordinal_position;
