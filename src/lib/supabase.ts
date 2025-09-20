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
export const ensureSchemaReady = async (maxRetries = 5) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Refreshing schema cache (attempt ${attempt}/${maxRetries})...`)
      await refreshSchemaCache()
      
      // Verify the video_url column exists by checking information_schema
      const { data: columnCheck, error: columnError } = await supabase
        .rpc('check_column_exists', {
          table_name: 'products',
          column_name: 'video_url'
        })
      
      if (columnError) {
        // Fallback method if RPC doesn't exist
        const { data, error: queryError } = await supabase
          .from('products')
          .select('video_url')
          .limit(1)
          
        if (queryError) {
          if (queryError.message.includes('video_url') || queryError.message.includes('column')) {
            console.log(`Video column not yet available (attempt ${attempt})`)
            await new Promise(resolve => setTimeout(resolve, 1500)) // Wait 1.5 seconds
            continue
          }
          throw queryError
        }
      } else if (columnCheck && columnCheck.length > 0 && !columnCheck[0].exists) {
        console.log(`Video column not yet available (attempt ${attempt})`)
        await new Promise(resolve => setTimeout(resolve, 1500))
        continue
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

// Create RPC function if it doesn't exist
export const createCheckColumnFunction = async () => {
  try {
    const { error } = await supabase.rpc('check_column_exists', {
      table_name: 'products',
      column_name: 'video_url'
    })
    
    if (error && error.message.includes('function')) {
      // Function doesn't exist, create it
      const { error: createError } = await supabase.rpc(`
        CREATE OR REPLACE FUNCTION check_column_exists(table_name text, column_name text)
        RETURNS TABLE(exists boolean)
        LANGUAGE sql
        AS $$
          SELECT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = $1 AND column_name = $2
          )
        $$;
      `)
      
      if (createError) {
        console.warn('Could not create check_column_exists function:', createError)
      } else {
        console.log('Created check_column_exists function')
      }
    }
  } catch (error) {
    console.warn('Error checking/creating RPC function:', error)
  }
}

// Initialize schema check on module load
createCheckColumnFunction()

// Video upload function with 15s max duration validation
export const uploadProductVideo = async (videoBlob: Blob, productId: string): Promise<string> => {
  try {
    // Validate video duration (15s max)
    const videoUrl = URL.createObjectURL(videoBlob)
    const video = document.createElement('video')
    
    const durationCheck = new Promise<number>((resolve, reject) => {
      video.addEventListener('loadedmetadata', () => {
        resolve(video.duration)
      })
      video.addEventListener('error', () => {
        reject(new Error('Failed to load video for duration check'))
      })
      video.src = videoUrl
    })

    const duration = await durationCheck
    URL.revokeObjectURL(videoUrl)

    if (duration > 15) {
      throw new Error(`Video duration (${duration.toFixed(1)}s) exceeds 15 second limit`)
    }

    // Upload to Supabase Storage
    const fileName = `${productId}/${Date.now()}.mp4`
    const { data, error } = await supabase.storage
      .from('product-videos')
      .upload(fileName, videoBlob, {
        contentType: 'video/mp4',
        upsert: true
      })

    if (error) {
      throw new Error(`Video upload failed: ${error.message}`)
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('product-videos')
      .getPublicUrl(fileName)

    return urlData.publicUrl

  } catch (error) {
    console.error('Video upload error:', error)
    throw error
  }
}

// Create storage bucket if it doesn't exist
export const ensureVideoBucketExists = async () => {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets()
    
    if (error) {
      console.warn('Could not list buckets:', error)
      return
    }

    const videoBucketExists = buckets?.some(bucket => bucket.name === 'product-videos')
    
    if (!videoBucketExists) {
      const { error: createError } = await supabase.storage.createBucket('product-videos', {
        public: true,
        fileSizeLimit: 50 * 1024 * 1024, // 50MB
        allowedMimeTypes: ['video/mp4', 'video/quicktime', 'video/x-msvideo']
      })
      
      if (createError) {
        console.warn('Could not create video bucket:', createError)
      } else {
        console.log('Created product-videos storage bucket')
      }
    }
  } catch (error) {
    console.warn('Error ensuring video bucket exists:', error)
  }
}

// Initialize storage bucket check
ensureVideoBucketExists()
