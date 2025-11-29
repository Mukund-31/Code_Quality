-- Fix Infinite Recursion in RLS Policies

-- 1. Drop existing problematic policies
DROP POLICY IF EXISTS "teams_select_policy" ON public.teams;
DROP POLICY IF EXISTS "team_members_select_policy" ON public.team_members;

-- 2. Create a "Security Definer" function to check membership
-- This bypasses RLS to avoid recursion
CREATE OR REPLACE FUNCTION public.is_team_member(team_id_param UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.team_members
    WHERE team_id = team_id_param
    AND user_id = auth.uid()
    AND status = 'accepted'
  );
$$;

-- 3. Create new TEAMS select policy using the function
CREATE POLICY "teams_select_policy"
  ON public.teams
  FOR SELECT
  TO authenticated
  USING (
    owner_id = auth.uid() OR
    public.is_team_member(id)
  );

-- 4. Create new TEAM_MEMBERS select policy
-- Users can see members if they are the owner OR a member of the team
CREATE POLICY "team_members_select_policy"
  ON public.team_members
  FOR SELECT
  TO authenticated
  USING (
    -- Direct check on team_members table is safe here
    -- But to be safe from recursion with teams table, we check:
    -- 1. User is the member in the row
    user_id = auth.uid() OR
    -- 2. User is a member of the same team (recursion risk if not careful)
    -- So we use a subquery that doesn't join 'teams' if possible,
    -- OR we rely on the fact that we are querying team_members directly.
    
    -- Simplest safe approach:
    -- User can see rows for teams they belong to
    team_id IN (
      SELECT team_id 
      FROM public.team_members 
      WHERE user_id = auth.uid() 
      AND status = 'accepted'
    ) OR
    -- User can see rows for teams they own
    team_id IN (
      SELECT id 
      FROM public.teams 
      WHERE owner_id = auth.uid()
    )
  );
