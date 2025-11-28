-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Users can insert own attempts" ON public.reel_attempts;

-- Create a permissive INSERT policy for demo purposes
CREATE POLICY "Allow all inserts for demo"
ON public.reel_attempts
FOR INSERT
WITH CHECK (true);