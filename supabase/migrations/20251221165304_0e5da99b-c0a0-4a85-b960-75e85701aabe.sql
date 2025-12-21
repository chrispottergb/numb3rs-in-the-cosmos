-- Create audio-tracks storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio-tracks', 'audio-tracks', true);

-- Allow public read access to audio files
CREATE POLICY "Public can read audio tracks"
ON storage.objects FOR SELECT
USING (bucket_id = 'audio-tracks');

-- Allow authenticated users to upload audio files
CREATE POLICY "Authenticated users can upload audio"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'audio-tracks' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete audio"
ON storage.objects FOR DELETE
USING (bucket_id = 'audio-tracks' AND auth.role() = 'authenticated');

-- Create audio_tracks table for metadata
CREATE TABLE public.audio_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  frequency TEXT,
  description TEXT,
  file_url TEXT NOT NULL,
  duration TEXT,
  uploaded_by UUID,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.audio_tracks ENABLE ROW LEVEL SECURITY;

-- Anyone can read tracks
CREATE POLICY "Anyone can read audio tracks"
ON public.audio_tracks FOR SELECT
USING (true);

-- Authenticated users can insert
CREATE POLICY "Authenticated users can insert tracks"
ON public.audio_tracks FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own tracks
CREATE POLICY "Users can update own tracks"
ON public.audio_tracks FOR UPDATE
USING (auth.uid() = uploaded_by);

-- Users can delete their own tracks
CREATE POLICY "Users can delete own tracks"
ON public.audio_tracks FOR DELETE
USING (auth.uid() = uploaded_by);