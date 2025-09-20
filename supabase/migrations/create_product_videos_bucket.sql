/*
  # Create product-videos storage bucket

  1. Changes
    - Create a new storage bucket named 'product-videos' for storing product demonstration videos
    - Configure bucket with public access for video streaming
    - Set maximum file size limit to 50MB (Supabase default is 50MB)

  2. Security
    - Enable public access for video streaming
    - Set up RLS policies to control upload access
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-videos', 'product-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policy for authenticated users to upload videos
CREATE POLICY "Authenticated users can upload product videos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'product-videos');

-- Create RLS policy for anyone to read videos (public access)
CREATE POLICY "Anyone can read product videos"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'product-videos');

-- Create RLS policy for product owners to update/delete their videos
CREATE POLICY "Users can update their own product videos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'product-videos' AND owner = auth.uid());

CREATE POLICY "Users can delete their own product videos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'product-videos' AND owner = auth.uid());
