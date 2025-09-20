import { useState } from 'react'
import { supabase, ensureSchemaReady } from '../lib/supabase'

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
      // Ensure schema is ready before operation
      await ensureSchemaReady()
      
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
        console.error('Supabase error:', supabaseError)
        throw new Error(supabaseError.message)
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
