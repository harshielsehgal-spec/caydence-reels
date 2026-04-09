
-- Notifications: Only backend/service_role can insert notifications
CREATE POLICY "Only backend can insert notifications"
ON public.notifications
FOR INSERT
TO service_role
WITH CHECK (true);

-- Notifications: Athletes can delete their own notifications
CREATE POLICY "Athletes can delete own notifications"
ON public.notifications
FOR DELETE
TO authenticated
USING (auth.uid() = athlete_id);

-- Storage: Add DELETE policy on reel_attempts bucket scoped to file owner
CREATE POLICY "Athletes can delete own attempt videos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'reel_attempts' AND (auth.uid())::text = (storage.foldername(name))[1]);

-- Storage: Add UPDATE policy on reel_attempts bucket scoped to file owner
CREATE POLICY "Athletes can update own attempt videos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'reel_attempts' AND (auth.uid())::text = (storage.foldername(name))[1]);
