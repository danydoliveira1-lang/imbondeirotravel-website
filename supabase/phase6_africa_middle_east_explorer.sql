-- Imbondeiro Travel
-- Phase 6: Africa & Middle East Explorer foundation

create extension if not exists pgcrypto;

create table if not exists public.explorer_destinations (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  slug text not null unique,
  country_code text not null unique,

  explorer_region text not null
    check (explorer_region in ('Africa', 'Middle East')),

  subregion text not null,
  capital text,

  launch_status text not null default 'coming_soon'
    check (
      launch_status in (
        'bookable',
        'tailor_made',
        'coming_soon'
      )
    ),

  supplier_status text not null default 'developing'
    check (
      supplier_status in (
        'ready',
        'developing',
        'not_started'
      )
    ),

  summary text,
  description text,

  hero_image text,
  hero_video_url text,

  experience_types text[] not null default '{}',
  best_months text,
  practical_information text,
  entry_information_notice text,

  currency text,
  languages text[] not null default '{}',

  map_latitude numeric(9,6),
  map_longitude numeric(9,6),

  enquiry_enabled boolean not null default true,
  published boolean not null default false,
  featured boolean not null default false,

  seo_title text,
  seo_description text,

  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists
  explorer_destinations_region_index
on public.explorer_destinations (
  explorer_region,
  subregion,
  sort_order
);

create index if not exists
  explorer_destinations_public_index
on public.explorer_destinations (
  published,
  launch_status,
  featured
);

create or replace function
  public.set_explorer_destination_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists
  explorer_destinations_updated_at
on public.explorer_destinations;

create trigger explorer_destinations_updated_at
before update on public.explorer_destinations
for each row
execute function
  public.set_explorer_destination_updated_at();

alter table public.explorer_destinations
enable row level security;

comment on table public.explorer_destinations is
  'Destination register powering the Imbondeiro Travel Africa and Middle East Explorer.';

comment on column public.explorer_destinations.launch_status is
  'Commercial state: bookable, tailor_made or coming_soon.';

comment on column public.explorer_destinations.supplier_status is
  'Internal supplier readiness: ready, developing or not_started.';

comment on column public.explorer_destinations.published is
  'Controls whether the destination may appear on the public website.';

comment on column public.explorer_destinations.enquiry_enabled is
  'Controls whether visitors may submit a journey enquiry for this destination.';
