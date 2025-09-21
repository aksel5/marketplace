/*
    # Add video column to products table

    1. Changes
      - Add `video` column to `products` table to support product videos
      - Column type: text (for storing video URLs)
      - Nullable: true (products may not have videos)
      - No default value

    2. Security
      - No RLS policy changes needed as this is just adding a column
      - Existing RLS policies will continue to work
  */

  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'products' AND column_name = 'video'
    ) THEN
      ALTER TABLE products ADD COLUMN video text;
    END IF;
  END $$;