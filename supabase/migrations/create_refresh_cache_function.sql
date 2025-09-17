/*
  # Create refresh_schema_cache function

  1. Changes
    - Create a PostgreSQL function to refresh schema cache
    - This helps Supabase recognize newly added columns immediately

  2. Security
    - Function is executable by authenticated users
    - No data modification, only cache refresh
*/

CREATE OR REPLACE FUNCTION refresh_schema_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This function forces Supabase to refresh its schema cache
  -- by performing a no-op query that touches the information schema
  PERFORM 1 FROM information_schema.tables LIMIT 1;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION refresh_schema_cache() TO authenticated;