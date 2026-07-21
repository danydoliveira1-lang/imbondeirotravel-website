-- PROJECT IMBONDEIRO — PHASE 5.1B LIVE COMMAND CENTRE
-- Run this entire file once in Supabase > SQL Editor.

create table if not exists public.tours (
  id text primary key,
  title text not null,
  location text,
  duration text,
  price numeric default 0,
  status text default 'Draft',
  video text,
  start text,
  "end" text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.departures (
  id text primary key,
  journey_id text,
  title text not null,
  location text,
  image text,
  start_date date not null,
  end_date date not null,
  duration text,
  maximum_guests integer default 0 check (maximum_guests >= 0),
  reserved_guests integer default 0 check (reserved_guests >= 0),
  held_guests integer default 0 check (held_guests >= 0),
  travel_style text,
  status text default 'available',
  featured boolean default false,
  guide text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint valid_departure_capacity check (reserved_guests + held_guests <= maximum_guests)
);

create table if not exists public.reservations (
  id text primary key,
  customer text not null,
  journey text,
  travellers integer default 1,
  status text default 'Enquiry',
  total numeric default 0,
  consultant text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.customers (
  id text primary key,
  name text not null,
  email text,
  phone text,
  language text,
  preference text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.media (
  id text primary key,
  name text not null,
  type text,
  reference text,
  usage text,
  status text default 'Active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.tours enable row level security;
alter table public.departures enable row level security;
alter table public.reservations enable row level security;
alter table public.customers enable row level security;
alter table public.media enable row level security;

-- The website and Command Centre access the database through secure server routes.
-- No public browser write policies are intentionally created.

insert into public.tours (id,title,location,duration,price,status,video,start,"end") values
('tour-kalandula','Kalandula Falls & Malanje','Malanje','3 days / 2 nights',1250,'Published','Gt3K_3KQlOM','05:04','05:22'),
('tour-kissama','Kissama Safari Escape','Bengo','Full day',320,'Published','xBZjmw9AreU','00:05','00:28'),
('tour-mbanza','M’Banza Kongo Heritage Journey','Zaire','3 days / 2 nights',980,'Draft','jkTv2xkPNi8','00:20','03:45')
on conflict (id) do nothing;

insert into public.departures (id,journey_id,title,location,image,start_date,end_date,duration,maximum_guests,reserved_guests,held_guests,travel_style,status,featured,guide) values
('departure:kalandula-september-2026','signature:kalandula-malanje','Kalandula Falls & Malanje','Malanje Province','/assets/highlight-kalandula.jpg','2026-09-12','2026-09-14','3 days / 2 nights',8,3,0,'Small Group','available',true,'Carlos Manuel'),
('departure:lubango-october-2026','signature:lubango-serra','Lubango & Serra da Leba','Huíla Province','/assets/serra-da-leba-approved.jpg','2026-10-10','2026-10-13','4 days / 3 nights',10,8,0,'Small Group','limited',true,'Ana Paulo'),
('departure:kissama-october-2026','signature:kissama','Kissama Safari Escape','Bengo Province','/assets/highlight-kissama.jpg','2026-10-24','2026-10-24','Full day',8,2,0,'Private & Small Group','available',true,'João Afonso'),
('departure:benguela-november-2026','signature:benguela-coast','Benguela & Lobito Coastal Escape','Benguela Province','/assets/benguela-coast-approved.webp','2026-11-14','2026-11-16','3 days / 2 nights',10,10,0,'Small Group','sold-out',false,'')
on conflict (id) do nothing;

insert into public.reservations (id,customer,journey,travellers,status,total,consultant) values
('IMB-260701','Amélia Costa','Kalandula Falls & Malanje',2,'On Hold',2500,'Daniela'),
('IMB-260702','Peter Williams','Kissama Safari Escape',4,'Confirmed',1280,'Daniela'),
('IMB-260703','Sofia Mendes','Private Angola Journey',2,'Enquiry',0,'Unassigned')
on conflict (id) do nothing;

insert into public.customers (id,name,email,phone,language,preference,notes) values
('cust-1','Amélia Costa','amelia@example.com','+351 912 000 111','Portuguese','Culture & nature','Vegetarian'),
('cust-2','Peter Williams','peter@example.com','+44 7700 900222','English','Wildlife','Airport meet & greet requested'),
('cust-3','Sofia Mendes','sofia@example.com','+244 923 000 333','Portuguese','Honeymoon','Interested in Maldives')
on conflict (id) do nothing;

insert into public.media (id,name,type,reference,usage,status) values
('media-1','Kalandula Hero','YouTube','Gt3K_3KQlOM','Homepage + destination','Active'),
('media-2','Traditional Dance','YouTube','U9ILT0S2GYA','Homepage hero','Active'),
('media-3','Imbondeiro Brand Mark','Image','/assets/logo.png','Global','Active')
on conflict (id) do nothing;
