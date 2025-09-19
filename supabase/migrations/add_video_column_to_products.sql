/*
  # Add video_url column to products table

  1. Changes
    - Add `video_url` column to `products` table to store video URLs
    - Column is nullable to maintain backward compatibility
    - Column type is text to store video URLs

  2. Security
    - No RLS policy changes needed as column addition doesn't affect existing policies
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'video_url'
  ) THEN
    ALTER TABLE products ADD COLUMN video_url text;
  END IF;
END $$;