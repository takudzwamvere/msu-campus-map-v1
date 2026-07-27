-- Database Schema for MSU Campus Map (Supabase / PostgreSQL)

-- 1. Building Contributions Table
create table if not exists public.building_contributions (
  id uuid default gen_random_uuid() primary key,
  building_name text not null,
  contributor_name text,
  contribution_type text not null check (contribution_type in ('hours', 'note', 'capacity', 'photo')),
  content text not null,
  approved boolean default false,
  upvotes integer default 0,
  created_at timestamptz default now()
);

-- Index for querying contributions by building name
create index if not exists idx_building_contributions_building on public.building_contributions(building_name);

-- RLS Policies for building contributions
alter table public.building_contributions enable row level security;

create policy "Approved contributions are viewable by everyone"
  on public.building_contributions for select
  using (approved = true);

create policy "Anyone can submit a contribution"
  on public.building_contributions for insert
  with check (true);

-- 2. Safety Reports Table
create table if not exists public.safety_reports (
  id uuid default gen_random_uuid() primary key,
  lat double precision not null,
  lng double precision not null,
  category text not null check (category in ('lighting', 'path', 'flooding', 'other')),
  description text,
  confirmed_count integer default 1,
  created_at timestamptz default now(),
  expires_at timestamptz default (now() + interval '48 hours')
);

alter table public.safety_reports enable row level security;

create policy "Active safety reports are viewable by everyone"
  on public.safety_reports for select
  using (expires_at > now());

create policy "Anyone can submit a safety report"
  on public.safety_reports for insert
  with check (true);

-- 3. Campus Events Table
create table if not exists public.campus_events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  building_name text,
  lat double precision not null,
  lng double precision not null,
  event_date timestamptz not null,
  category text not null check (category in ('academic', 'sports', 'social', 'ceremony')),
  created_at timestamptz default now()
);

alter table public.campus_events enable row level security;

create policy "Campus events are viewable by everyone"
  on public.campus_events for select
  using (true);
