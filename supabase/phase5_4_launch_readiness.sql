-- Phase 5.4 launch-readiness migration
-- Safe to run more than once in the Supabase SQL Editor.

alter table if exists public.reservations
  add column if not exists customer_id text;

alter table if exists public.reservations
  add column if not exists notes text;

create index if not exists reservations_customer_id_idx
  on public.reservations (customer_id);

create index if not exists reservations_status_idx
  on public.reservations (status);

create index if not exists customers_email_lower_idx
  on public.customers (lower(email));
