-- Update plans for test users

-- 1. Free User
UPDATE public.profiles
SET plan = 'free'
WHERE email = 'shashidhars.cd22@rvce.edu.in';

-- 2. Pro User
UPDATE public.profiles
SET plan = 'pro'
WHERE email = 'ishashisarvi@gmail.com';

-- 3. Elite User
UPDATE public.profiles
SET plan = 'elite'
WHERE email = 'billy973171@gmail.com';

-- Verify the updates
SELECT email, plan FROM public.profiles WHERE email IN (
  'shashidhars.cd22@rvce.edu.in',
  'ishashisarvi@gmail.com',
  'billy973171@gmail.com'
);
