-- Imbondeiro Command Centre Phase 5.1
-- Run this in Supabase SQL Editor when activating the shared cloud database.
create extension if not exists "pgcrypto";

create type public.booking_status as enum ('enquiry','on_hold','quoted','deposit_paid','confirmed','travelled','cancelled');
create type public.content_status as enum ('draft','published','archived');
create type public.departure_status as enum ('open','limited','sold_out','closed','cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'reservations' check (role in ('administrator','reservations','operations','content_editor')),
  created_at timestamptz not null default now()
);

create table public.tours (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  location text,
  description text,
  duration text,
  price numeric(12,2) default 0,
  currency text default 'EUR',
  hero_video_id text,
  video_start_seconds integer default 0,
  video_end_seconds integer,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.departures (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references public.tours(id) on delete cascade,
  departure_date date not null,
  capacity integer not null check (capacity >= 0),
  price numeric(12,2),
  guide_name text,
  status public.departure_status not null default 'open',
  created_at timestamptz not null default now(),
  unique(tour_id, departure_date)
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  nationality text,
  preferred_language text,
  travel_preferences text,
  dietary_requirements text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  booking_reference text unique not null,
  customer_id uuid not null references public.customers(id),
  departure_id uuid references public.departures(id),
  journey_name text not null,
  travellers integer not null default 1 check (travellers > 0),
  status public.booking_status not null default 'enquiry',
  total_amount numeric(12,2) default 0,
  currency text default 'EUR',
  assigned_to uuid references public.profiles(id),
  hold_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.media (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  media_type text not null check (media_type in ('image','youtube','video','document')),
  reference text not null,
  usage text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create view public.departure_inventory as
select d.id, d.tour_id, d.departure_date, d.capacity, d.status,
  coalesce(sum(r.travellers) filter (where r.status in ('confirmed','deposit_paid')),0)::int as booked,
  coalesce(sum(r.travellers) filter (where r.status = 'on_hold' and (r.hold_expires_at is null or r.hold_expires_at > now())),0)::int as held,
  greatest(d.capacity - coalesce(sum(r.travellers) filter (where r.status in ('confirmed','deposit_paid','on_hold') and (r.status <> 'on_hold' or r.hold_expires_at is null or r.hold_expires_at > now())),0)::int,0) as available
from public.departures d left join public.reservations r on r.departure_id = d.id
group by d.id;

alter table public.profiles enable row level security;
alter table public.tours enable row level security;
alter table public.departures enable row level security;
alter table public.customers enable row level security;
alter table public.reservations enable row level security;
alter table public.media enable row level security;

create policy "staff can read tours" on public.tours for select to authenticated using (true);
create policy "staff can manage tours" on public.tours for all to authenticated using (true) with check (true);
create policy "staff can manage departures" on public.departures for all to authenticated using (true) with check (true);
create policy "staff can manage customers" on public.customers for all to authenticated using (true) with check (true);
create policy "staff can manage reservations" on public.reservations for all to authenticated using (true) with check (true);
create policy "staff can manage media" on public.media for all to authenticated using (true) with check (true);
create policy "users can read own profile" on public.profiles for select to authenticated using (auth.uid() = id);
