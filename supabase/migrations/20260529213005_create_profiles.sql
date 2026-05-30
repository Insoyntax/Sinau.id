-- Migration: Create profiles table
-- Stores user profile data synced from auth.users

create table if not exists public.profiles (
  id              uuid        primary key references auth.users(id) on delete cascade,
  full_name       text        not null,
  username        text        not null unique,
  birth_date      text        not null,
  role            text        not null default 'Pelajar',
  onboarded       boolean     not null default false,
  daily_minutes   integer     default null,
  study_goal      text        default null,
  interests       text[]      default null,
  pet_choice      text        default null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- RLS Policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup via trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, username, birth_date, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'username', ''),
    coalesce(new.raw_user_meta_data ->> 'birth_date', ''),
    coalesce(new.raw_user_meta_data ->> 'role', 'Pelajar')
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at timestamp
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();
