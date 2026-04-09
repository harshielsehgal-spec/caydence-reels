
DROP POLICY IF EXISTS "Authenticated users can upload to reel_attempts" ON storage.objects;

CREATE POLICY "Allow anon uploads to reel_attempts"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'reel_attempts');
