import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Utility to refresh schema cache
export const refreshSchemaCache = async () => {
  try {
    await supabase.rpc('refresh_schema_cache')
  } catch (error) {
    console.warn('Schema cache refresh not available, proceeding without cache refresh')
  }
}
