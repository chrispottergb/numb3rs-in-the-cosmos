-- Allow anyone to upload files to audio-tracks bucket
CREATE POLICY "Anyone can upload audio tracks"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'audio-tracks');

-- Allow anyone to read audio files
CREATE POLICY "Anyone can read audio tracks"
ON storage.objects
FOR SELECT
USING (bucket_id = 'audio-tracks');