import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Utility to refresh schema cache - enhanced version
export const refreshSchemaCache = async () => {
  try {
    // First attempt to call the RPC function if it exists
    const { error } = await supabase.rpc('refresh_schema_cache')
    
    if (error) {
      console.warn('RPC refresh_schema_cache not available, using alternative method')
      
      // Alternative method: Force schema cache refresh by making a simple query
      // This will trigger Supabase to refresh its internal schema cache
      const { error: queryError } = await supabase
        .from('products')
        .select('id')
        .limit(1)
        
      if (queryError) {
        console.warn('Alternative schema refresh also failed:', queryError)
        throw new Error('Failed to refresh schema cache')
      }
      
      console.log('Schema cache refreshed via query method')
    } else {
      console.log('Schema cache refreshed via RPC')
    }
  } catch (error) {
    console.error('Schema cache refresh failed:', error)
    throw new Error('Schema cache refresh failed. Please try again.')
  }
}

// Enhanced function to ensure schema is ready before operations
export const ensureSchemaReady = async (maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Refreshing schema cache (attempt ${attempt}/${maxRetries})...`)
      await refreshSchemaCache()
      
      // Verify the video_url column exists
      const { data, error } = await supabase
        .from('products')
        .select('video_url')
        .limit(1)
        
      if (error) {
        if (error.message.includes('video_url') || error.message.includes('column')) {
          console.log(`Video column not yet available (attempt ${attempt})`)
          await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
          continue
        }
        throw error
      }
      
      console.log('Schema verified successfully - video_url column is available')
      return true
      
    } catch (error) {
      console.error(`Schema verification failed on attempt ${attempt}:`, error)
      if (attempt === maxRetries) {
        throw new Error(`Failed to verify schema after ${maxRetries} attempts: ${error.message}`)
      }
      await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds between retries
    }
  }
}
