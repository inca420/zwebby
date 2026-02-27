-- Zwebby MVP Database Schema

-- 1. Create a table to store extended user data (optional, but good practice alongside auth.users)
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  role text default 'user' check (role in ('user', 'superadmin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security (RLS) for the users table
alter table public.users enable row level security;

-- Policy: Users can read their own data
create policy "Users can view own data" on public.users
  for select using (auth.uid() = id);

-- Trigger to automatically create a public.user when a new auth.user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Create a table to store the websites/projects
create table public.websites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  name text not null,
  content jsonb default '{}'::jsonb not null, -- Stores the actual builder blocks/data
  is_published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on RLS for the websites table
alter table public.websites enable row level security;

-- Policies for websites
-- Users can completely manage their own websites
create policy "Users can view their own websites" on public.websites
  for select using (auth.uid() = user_id);

create policy "Users can insert their own websites" on public.websites
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own websites" on public.websites
  for update using (auth.uid() = user_id);

create policy "Users can delete their own websites" on public.websites
  for delete using (auth.uid() = user_id);

-- Optional: Allow public to view ONLY published websites
create policy "Public can view published websites" on public.websites
  for select using (is_published = true);
