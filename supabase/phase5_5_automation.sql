-- PROJECT IMBONDEIRO — PHASE 5.5 COMMAND CENTRE AUTOMATION
-- Internal automation foundation. Safe to run more than once.
-- This phase creates internal tasks only; it does not contact customers.

create extension if not exists "pgcrypto";

alter table if exists public.reservations
  add column if not exists follow_up_due_at timestamptz;

alter table if exists public.reservations
  add column if not exists hold_expires_at timestamptz;

alter table if exists public.reservations
  add column if not exists last_contacted_at timestamptz;

create table if not exists public.automation_rules (
  id text primary key,
  name text not null,
  description text,
  entity_type text not null,
  enabled boolean not null default true,
  severity text not null default 'medium'
    check (severity in ('low', 'medium', 'high', 'critical')),
  threshold_hours integer not null default 24
    check (threshold_hours >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.automation_tasks (
  id uuid primary key default gen_random_uuid(),
  rule_id text not null references public.automation_rules(id),
  entity_type text not null,
  entity_id text not null,
  title text not null,
  description text,
  severity text not null default 'medium'
    check (severity in ('low', 'medium', 'high', 'critical')),
  status text not null default 'open'
    check (status in ('open', 'completed', 'dismissed')),
  due_at timestamptz,
  detected_at timestamptz not null default now(),
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  fingerprint text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.automation_runs (
  id uuid primary key default gen_random_uuid(),
  mode text not null default 'manual'
    check (mode in ('manual', 'scheduled')),
  status text not null default 'running'
    check (status in ('running', 'completed', 'failed')),
  tasks_created integer not null default 0,
  tasks_updated integer not null default 0,
  tasks_resolved integer not null default 0,
  error_message text,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists automation_tasks_status_due_idx
  on public.automation_tasks (status, due_at);

create index if not exists automation_tasks_entity_idx
  on public.automation_tasks (entity_type, entity_id);

create index if not exists automation_tasks_rule_idx
  on public.automation_tasks (rule_id);

create index if not exists automation_runs_started_idx
  on public.automation_runs (started_at desc);

alter table public.automation_rules enable row level security;
alter table public.automation_tasks enable row level security;
alter table public.automation_runs enable row level security;

-- The Command Centre uses authenticated server routes with the service-role key.
-- No public browser policies are intentionally created.

insert into public.automation_rules
  (id, name, description, entity_type, enabled, severity, threshold_hours)
values
  (
    'enquiry_follow_up',
    'New enquiry follow-up',
    'Flags an enquiry that has not been contacted within the configured period.',
    'reservation',
    true,
    'high',
    24
  ),
  (
    'quote_follow_up',
    'Quote follow-up',
    'Flags a quoted reservation that still needs a customer decision.',
    'reservation',
    true,
    'medium',
    72
  ),
  (
    'hold_expiry',
    'Hold expiry',
    'Flags a reservation hold that is approaching expiry or has expired.',
    'reservation',
    true,
    'high',
    24
  ),
  (
    'payment_attention',
    'Payment attention',
    'Flags a pending or overdue payment requiring review.',
    'payment',
    true,
    'high',
    48
  ),
  (
    'departure_readiness',
    'Departure readiness',
    'Flags an approaching departure with incomplete operational preparation.',
    'departure',
    true,
    'critical',
    168
  )
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  entity_type = excluded.entity_type,
  severity = excluded.severity,
  threshold_hours = excluded.threshold_hours,
  updated_at = now();
