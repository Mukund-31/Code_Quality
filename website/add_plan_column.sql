-- Add plan column to profiles table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'plan') THEN
        ALTER TABLE public.profiles ADD COLUMN plan VARCHAR(20) DEFAULT 'free';
        ALTER TABLE public.profiles ADD CONSTRAINT check_plan CHECK (plan IN ('free', 'pro', 'elite'));
    END IF;
END $$;

-- Update existing users to 'free' if null (just in case)
UPDATE public.profiles SET plan = 'free' WHERE plan IS NULL;

-- For testing purposes, let's set the current user to 'elite' so you don't lose access immediately!
-- (You can change this back to 'free' or 'pro' to test the other views)
UPDATE public.profiles 
SET plan = 'elite' 
WHERE id = auth.uid();
