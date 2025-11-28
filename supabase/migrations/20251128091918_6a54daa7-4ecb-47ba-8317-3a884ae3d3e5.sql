-- Add storage policies for reel_attempts bucket to allow authenticated uploads
CREATE POLICY "Authenticated users can upload attempts"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'reel_attempts' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Anyone can view attempt videos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'reel_attempts');

-- Also allow anonymous uploads for demo purposes
CREATE POLICY "Allow anonymous uploads for demo"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'reel_attempts'
);