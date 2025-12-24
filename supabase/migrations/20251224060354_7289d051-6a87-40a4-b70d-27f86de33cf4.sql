-- Drop existing restrictive INSERT policy
DROP POLICY IF EXISTS "Authenticated users can insert tracks" ON public.audio_tracks;

-- Create policy allowing anyone to insert tracks (no auth required for now)
CREATE POLICY "Anyone can insert tracks" 
ON public.audio_tracks 
FOR INSERT 
WITH CHECK (true);