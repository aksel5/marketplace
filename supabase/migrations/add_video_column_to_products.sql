/*
  # Add video column to products table

  1. Changes
    - Add `video_url` column to `products` table to store video URLs for product demonstrations
    - Column is nullable to maintain backward compatibility with existing products

  2. Security
    - No RLS policy changes needed as this is just adding a new column
    - Existing RLS policies will automatically apply to the new column
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