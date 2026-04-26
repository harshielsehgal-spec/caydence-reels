-- Restrict reel_likes SELECT: only the owner can read their own like rows.
-- Likes UI uses local React state (per project memory), so no SELECT is required for the demo.
DROP POLICY IF EXISTS "Likes are publicly readable" ON public.reel_likes;

CREATE POLICY "Users can view their own likes"
ON public.reel_likes
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);