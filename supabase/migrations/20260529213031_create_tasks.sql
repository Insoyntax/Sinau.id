-- Migration: Create tasks table (Kanban board)
-- Stores user tasks with 4-column kanban status flow

create table if not exists public.tasks (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references public.profiles(id) on delete cascade,
  title       text        not null,
  subject     text        not null default 'Umum',
  status      text        not null default 'rencana'
                          check (status in ('rencana', 'dikerjakan', 'evaluasi', 'selesai')),
  xp          integer     not null default 20,
  due_at      timestamptz default null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.tasks enable row level security;

-- RLS Policies
create policy "Users can view their own tasks"
  on public.tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own tasks"
  on public.tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on public.tasks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on public.tasks for delete
  using (auth.uid() = user_id);

-- Index for fast user-based queries
create index if not exists tasks_user_id_idx on public.tasks(user_id);
create index if not exists tasks_status_idx  on public.tasks(status);

-- Auto-update updated_at
create trigger tasks_updated_at
  before update on public.tasks
  for each row execute procedure public.set_updated_at();
