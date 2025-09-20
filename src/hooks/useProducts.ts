import { useState } from 'react'
import { supabase } from '../lib/supabase'

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

  const createProduct = async (product: Omit<Product, 'id' | 'created_at'>) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('products')
        .insert([{
          name: product.name,
          description: product.description,
          price: product.price,
          video_url: product.video_url || null
        }])
        .select()
        .single()

      if (supabaseError) {
        throw new Error(supabaseError.message)
      }

      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const uploadProductVideo = async (videoBlob: Blob, productId: string): Promise<string> => {
    try {
      // Create a unique filename for the video
      const fileName = `products/${productId}/video-${Date.now()}.mp4`
      
      // Upload video to Supabase Storage
      const { data, error } = await supabase.storage
        .from('product-videos')
        .upload(fileName, videoBlob, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        throw new Error(`Video upload failed: ${error.message}`)
      }

      // Get public URL for the uploaded video
      const { data: urlData } = supabase.storage
        .from('product-videos')
        .getPublicUrl(fileName)

      return urlData.publicUrl
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to upload video')
    }
  }

  const createProductWithVideo = async (
    productData: Omit<Product, 'id' | 'created_at' | 'video_url'>,
    videoBlob?: Blob
  ): Promise<Product> => {
    setLoading(true)
    setError(null)

    try {
      // First create the product without video
      const product = await createProduct(productData)

      // If video is provided, upload it and update the product
      if (videoBlob && product.id) {
        const videoUrl = await uploadProductVideo(videoBlob, product.id)
        
        // Update product with video URL
        const { data: updatedProduct, error: updateError } = await supabase
          .from('products')
          .update({ video_url: videoUrl })
          .eq('id', product.id)
          .select()
          .single()

        if (updateError) {
          throw new Error(`Failed to update product with video: ${updateError.message}`)
        }

        return updatedProduct
      }

      return product
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product with video')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    createProduct,
    createProductWithVideo,
    uploadProductVideo,
    loading,
    error
  }
}
