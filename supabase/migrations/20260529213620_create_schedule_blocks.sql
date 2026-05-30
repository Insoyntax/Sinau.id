-- Migration: Create schedule_blocks table (Weekly Timetable)
-- Stores reusable weekly schedule blocks for each user

create table if not exists public.schedule_blocks (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references public.profiles(id) on delete cascade,
  title        text        not null,
  day_of_week  integer     not null check (day_of_week >= 0 and day_of_week <= 6),
  -- 0 = Senin ... 6 = Minggu (mirrors JS Sunday=0 convention offset by 1)
  start_hour   integer     not null check (start_hour >= 0 and start_hour <= 23),
  span_hours   integer     not null default 1 check (span_hours >= 1 and span_hours <= 8),
  created_at   timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.schedule_blocks enable row level security;

-- RLS Policies
create policy "Users can view their own schedule blocks"
  on public.schedule_blocks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own schedule blocks"
  on public.schedule_blocks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own schedule blocks"
  on public.schedule_blocks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own schedule blocks"
  on public.schedule_blocks for delete
  using (auth.uid() = user_id);

-- Indexes
create index if not exists schedule_blocks_user_id_idx      on public.schedule_blocks(user_id);
create index if not exists schedule_blocks_day_of_week_idx  on public.schedule_blocks(day_of_week);
