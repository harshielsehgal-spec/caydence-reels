
-- Fix reel_attempts RLS: drop demo policy, add proper policies
DROP POLICY IF EXISTS "Allow all inserts for demo" ON public.reel_attempts;

CREATE POLICY "Athletes can submit own attempts"
ON public.reel_attempts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = athlete_id);

CREATE POLICY "Deny all updates on attempts"
ON public.reel_attempts FOR UPDATE
USING (false);

CREATE POLICY "Athletes can delete own attempts"
ON public.reel_attempts FOR DELETE
TO authenticated
USING (auth.uid() = athlete_id);

-- Fix storage: drop anonymous upload policy
DROP POLICY IF EXISTS "Allow anonymous uploads for demo" ON storage.objects;
