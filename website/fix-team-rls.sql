-- Quick Fix for RLS Policies
-- Run this in Supabase SQL Editor to fix the team creation issue

-- Step 1: Drop all existing policies
DROP POLICY IF EXISTS "teams_select_own_or_member" ON public.teams;
DROP POLICY IF EXISTS "teams_select_own" ON public.teams;
DROP POLICY IF EXISTS "teams_insert_own" ON public.teams;
DROP POLICY IF EXISTS "teams_update_own" ON public.teams;
DROP POLICY IF EXISTS "teams_delete_own" ON public.teams;

DROP POLICY IF EXISTS "team_members_select_own_teams" ON public.team_members;
DROP POLICY IF EXISTS "team_members_select_by_owner" ON public.team_members;
DROP POLICY IF EXISTS "team_members_insert_by_owner" ON public.team_members;
DROP POLICY IF EXISTS "team_members_update_own_or_owner" ON public.team_members;
DROP POLICY IF EXISTS "team_members_delete_by_owner" ON public.team_members;

DROP POLICY IF EXISTS "team_invitations_select_own_or_recipient" ON public.team_invitations;
DROP POLICY IF EXISTS "team_invitations_insert_by_owner" ON public.team_invitations;
DROP POLICY IF EXISTS "team_invitations_update_own" ON public.team_invitations;
DROP POLICY IF EXISTS "team_invitations_delete_by_owner" ON public.team_invitations;

-- Step 2: Create simple, working policies

-- TEAMS policies
CREATE POLICY "teams_select_policy"
  ON public.teams
  FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "teams_insert_policy"
  ON public.teams
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "teams_update_policy"
  ON public.teams
  FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "teams_delete_policy"
  ON public.teams
  FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- TEAM_MEMBERS policies
CREATE POLICY "team_members_select_policy"
  ON public.team_members
  FOR SELECT
  TO authenticated
  USING (
    team_id IN (
      SELECT id FROM public.teams WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "team_members_insert_policy"
  ON public.team_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    team_id IN (
      SELECT id FROM public.teams WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "team_members_update_policy"
  ON public.team_members
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() OR
    team_id IN (
      SELECT id FROM public.teams WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "team_members_delete_policy"
  ON public.team_members
  FOR DELETE
  TO authenticated
  USING (
    team_id IN (
      SELECT id FROM public.teams WHERE owner_id = auth.uid()
    )
  );

-- TEAM_INVITATIONS policies
CREATE POLICY "team_invitations_select_policy"
  ON public.team_invitations
  FOR SELECT
  TO authenticated
  USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
    team_id IN (
      SELECT id FROM public.teams WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "team_invitations_insert_policy"
  ON public.team_invitations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    team_id IN (
      SELECT id FROM public.teams WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "team_invitations_update_policy"
  ON public.team_invitations
  FOR UPDATE
  TO authenticated
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "team_invitations_delete_policy"
  ON public.team_invitations
  FOR DELETE
  TO authenticated
  USING (
    team_id IN (
      SELECT id FROM public.teams WHERE owner_id = auth.uid()
    )
  );

-- Step 3: Verify RLS is enabled
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;

-- Done! Try creating a team now.
