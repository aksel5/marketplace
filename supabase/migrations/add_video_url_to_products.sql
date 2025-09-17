/*
  # Add video_url column to products table

  1. Changes
    - Add `video_url` column to `products` table to store product video URLs
    - Column is nullable since videos are optional
    - Column type is text to store URL strings

  2. Security
    - No RLS policy changes needed as this is just a schema addition
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