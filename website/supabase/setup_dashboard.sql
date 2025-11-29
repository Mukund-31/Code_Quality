-- Quick Setup Script for Dashboard Features
-- Run this in your Supabase SQL Editor

-- ============================================
-- STEP 1: Verify existing tables
-- ============================================
-- Check if work_sessions exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'work_sessions'
) as work_sessions_exists;

-- Check if review_events exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'review_events'
) as review_events_exists;

-- ============================================
-- STEP 2: Create team_tasks table (if not exists)
-- ============================================
create table if not exists public.team_tasks (
  id uuid default gen_random_uuid() primary key,
  team_id uuid not null references public.teams(id) on delete cascade,
  title text not null,
  description text,
  assigned_to uuid references auth.users(id) on delete set null,
  created_by uuid not null references auth.users(id) on delete cascade,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'review', 'done')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  due_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- STEP 3: Create indexes
-- ============================================
create index if not exists team_tasks_team_id_idx on public.team_tasks(team_id);
create index if not exists team_tasks_assigned_to_idx on public.team_tasks(assigned_to);
create index if not exists team_tasks_status_idx on public.team_tasks(status);

-- ============================================
-- STEP 4: Enable RLS
-- ============================================
alter table public.team_tasks enable row level security;

-- ============================================
-- STEP 5: Drop existing policies (if any)
-- ============================================
drop policy if exists "Team members can view tasks" on public.team_tasks;
drop policy if exists "Team owners can insert tasks" on public.team_tasks;
drop policy if exists "Team owners can update tasks" on public.team_tasks;
drop policy if exists "Team owners can delete tasks" on public.team_tasks;

-- ============================================
-- STEP 6: Create RLS policies
-- ============================================

-- Policy: Team members can view tasks
create policy "Team members can view tasks"
  on public.team_tasks
  for select
  using (
    exists (
      select 1 from public.team_members
      where team_members.team_id = team_tasks.team_id
        and team_members.user_id = auth.uid()
        and team_members.status = 'accepted'
    )
  );

-- Policy: Team owners can insert tasks
create policy "Team owners can insert tasks"
  on public.team_tasks
  for insert
  with check (
    exists (
      select 1 from public.teams
      where teams.id = team_tasks.team_id
        and teams.owner_id = auth.uid()
    )
  );

-- Policy: Team owners can update tasks
create policy "Team owners can update tasks"
  on public.team_tasks
  for update
  using (
    exists (
      select 1 from public.teams
      where teams.id = team_tasks.team_id
        and teams.owner_id = auth.uid()
    )
  );

-- Policy: Team owners can delete tasks
create policy "Team owners can delete tasks"
  on public.team_tasks
  for delete
  using (
    exists (
      select 1 from public.teams
      where teams.id = team_tasks.team_id
        and teams.owner_id = auth.uid()
    )
  );

-- ============================================
-- STEP 7: Create trigger function
-- ============================================
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================
-- STEP 8: Create trigger
-- ============================================
drop trigger if exists update_team_tasks_updated_at on public.team_tasks;

create trigger update_team_tasks_updated_at
  before update on public.team_tasks
  for each row
  execute function public.update_updated_at_column();

-- ============================================
-- STEP 9: Verify setup
-- ============================================
SELECT 
  'team_tasks table created' as status,
  count(*) as policy_count
FROM pg_policies 
WHERE tablename = 'team_tasks';

-- ============================================
-- STEP 10: Sample data (optional - for testing)
-- ============================================
-- Uncomment to insert sample tasks for testing
/*
INSERT INTO public.team_tasks (team_id, title, description, priority, status, created_by)
SELECT 
  t.id,
  'Sample Task: ' || t.name,
  'This is a sample task for testing the task board',
  'medium',
  'todo',
  t.owner_id
FROM public.teams t
LIMIT 3;
*/
