-- Update RLS policy to allow viewing teams where user is a member
DROP POLICY IF EXISTS "teams_select_policy" ON public.teams;

CREATE POLICY "teams_select_policy"
  ON public.teams
  FOR SELECT
  TO authenticated
  USING (
    owner_id = auth.uid() OR
    id IN (
      SELECT team_id FROM public.team_members
      WHERE user_id = auth.uid() AND status = 'accepted'
    )
  );
