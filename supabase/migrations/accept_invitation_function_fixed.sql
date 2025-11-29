-- Function to accept a team invitation
CREATE OR REPLACE FUNCTION public.accept_team_invitation(token_str TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with superuser privileges to bypass RLS for the token lookup
SET search_path = public
AS $$
DECLARE
  invite_record RECORD;
  current_user_email TEXT;
  current_user_id UUID;
BEGIN
  -- Get current user details
  current_user_id := auth.uid();
  current_user_email := auth.email();

  -- Check if user is logged in
  IF current_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  -- Find the invitation
  SELECT * INTO invite_record
  FROM public.team_invitations
  WHERE token = token_str;

  -- Validate invitation
  IF invite_record IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid invitation token');
  END IF;

  IF invite_record.expires_at < NOW() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invitation has expired');
  END IF;

  -- Verify email matches (case insensitive)
  IF LOWER(invite_record.email) != LOWER(current_user_email) THEN
    RETURN jsonb_build_object('success', false, 'error', 'This invitation is for ' || invite_record.email || ', but you are logged in as ' || current_user_email);
  END IF;

  -- Update team member status to accepted
  UPDATE public.team_members
  SET 
    status = 'accepted',
    user_id = current_user_id, -- Link the actual user ID
    accepted_at = NOW()
  WHERE team_id = invite_record.team_id AND LOWER(email) = LOWER(current_user_email);

  -- If no member record exists (shouldn't happen, but safety check), insert one
  IF NOT FOUND THEN
    INSERT INTO public.team_members (team_id, user_id, email, role, status, accepted_at)
    VALUES (invite_record.team_id, current_user_id, current_user_email, 'member', 'accepted', NOW());
  END IF;

  -- Delete the invitation (it's used now)
  DELETE FROM public.team_invitations
  WHERE id = invite_record.id;

  RETURN jsonb_build_object('success', true, 'team_id', invite_record.team_id);
END;
$$;
