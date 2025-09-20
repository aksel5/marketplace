import { useState } from 'react'
import { supabase, ensureSchemaReady, uploadProductVideo } from '../lib/supabase'

export interface Product {
  id?: string
  name: string
  description: string
  price: number
  video_url?: string
  created_at?: string
}

export const useProducts = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createProduct = async (product: Omit<Product, 'id' | 'created_at'>, videoBlob?: Blob) => {
    setLoading(true)
    setError(null)
    
    try {
      // Ensure schema is ready before operation
      await ensureSchemaReady()
      
      let videoUrl: string | undefined
      
      // Upload video if provided
      if (videoBlob) {
        console.log('Starting video upload...')
        videoUrl = await uploadProductVideo(videoBlob, 'temp-product-id')
      }

      const { data, error: supabaseError } = await supabase
        .from('products')
        .insert([{
          name: product.name,
          description: product.description,
          price: product.price,
          video_url: videoUrl || null
        }])
        .select()
        .single()

      if (supabaseError) {
        console.error('Supabase error:', supabaseError)
        throw new Error(supabaseError.message)
      }

      // If we have a video and product was created successfully, update with final video URL
      if (videoBlob && data.id) {
        try {
          const finalVideoUrl = await uploadProductVideo(videoBlob, data.id)
          const { error: updateError } = await supabase
            .from('products')
            .update({ video_url: finalVideoUrl })
            .eq('id', data.id)

          if (updateError) {
            console.warn('Failed to update product with final video URL:', updateError)
          } else {
            data.video_url = finalVideoUrl
          }
        } catch (videoError) {
          console.warn('Failed to upload final video:', videoError)
        }
      }

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product'
      setError(errorMessage)
      console.error('Product creation error:', err)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    createProduct,
    loading,
    error
  }
}
