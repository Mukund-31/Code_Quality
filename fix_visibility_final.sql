-- Fix Team Members Visibility
-- The previous policy might have had subtle recursion or logic issues.
-- We will use the SECURITY DEFINER function to break all recursion loops.

-- 1. Ensure the helper function exists and is correct
CREATE OR REPLACE FUNCTION public.is_team_member(team_id_param UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER -- Bypasses RLS
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

-- 2. Create a helper function for ownership too, to be absolutely safe from recursion
CREATE OR REPLACE FUNCTION public.is_team_owner(team_id_param UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER -- Bypasses RLS
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.teams
    WHERE id = team_id_param
    AND owner_id = auth.uid()
  );
$$;

-- 3. Update Team Members Policy
DROP POLICY IF EXISTS "team_members_select_policy" ON public.team_members;

CREATE POLICY "team_members_select_policy"
  ON public.team_members
  FOR SELECT
  TO authenticated
  USING (
    -- User can see themselves
    user_id = auth.uid() OR
    -- User can see members if they are the owner (using safe function)
    public.is_team_owner(team_id) OR
    -- User can see members if they are a member (using safe function)
    public.is_team_member(team_id)
  );

-- 4. Update Teams Policy (just to be sure)
DROP POLICY IF EXISTS "teams_select_policy" ON public.teams;

CREATE POLICY "teams_select_policy"
  ON public.teams
  FOR SELECT
  TO authenticated
  USING (
    owner_id = auth.uid() OR
    public.is_team_member(id)
  );
