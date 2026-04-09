
-- Allow authenticated users to upload to their own folder in reel_attempts
CREATE POLICY "Authenticated users can upload to reel_attempts"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'reel_attempts' AND (auth.uid())::text = (storage.foldername(name))[1]);

-- Allow public reads from reel_attempts
CREATE POLICY "Allow public reads from reel_attempts"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'reel_attempts');
