-- Migration: Create study_sessions table (Focus Sessions + Dashboard)
-- Records completed focus sessions, used for XP, streaks, and pet evolution

create table if not exists public.study_sessions (
  id                uuid        primary key default gen_random_uuid(),
  user_id           uuid        not null references public.profiles(id) on delete cascade,
  subject           text        not null,
  duration_minutes  integer     not null check (duration_minutes > 0),
  xp_earned         integer     not null default 0 check (xp_earned >= 0),
  completed_at      timestamptz not null default now(),
  created_at        timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.study_sessions enable row level security;

-- RLS Policies
create policy "Users can view their own study sessions"
  on public.study_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own study sessions"
  on public.study_sessions for insert
  with check (auth.uid() = user_id);

-- Indexes for dashboard queries (streak, total minutes, etc.)
create index if not exists study_sessions_user_id_idx      on public.study_sessions(user_id);
create index if not exists study_sessions_completed_at_idx on public.study_sessions(user_id, completed_at desc);

-- Helper view: total XP per user (used for pet evolution logic)
create or replace view public.user_xp_totals as
  select
    user_id,
    sum(xp_earned)         as total_xp,
    sum(duration_minutes)  as total_minutes,
    count(*)               as total_sessions
  from public.study_sessions
  group by user_id;
