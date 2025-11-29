-- Fix RLS policies for team_tasks to include team owners
-- Run this in Supabase SQL Editor

-- Drop existing policies
drop policy if exists "Team members can view tasks" on public.team_tasks;
drop policy if exists "Team owners can insert tasks" on public.team_tasks;
drop policy if exists "Team owners can update tasks" on public.team_tasks;
drop policy if exists "Team owners can delete tasks" on public.team_tasks;

-- Policy: Team members AND owners can view tasks
create policy "Team members and owners can view tasks"
  on public.team_tasks
  for select
  using (
    -- User is team owner
    exists (
      select 1 from public.teams
      where teams.id = team_tasks.team_id
        and teams.owner_id = auth.uid()
    )
    OR
    -- User is team member
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
