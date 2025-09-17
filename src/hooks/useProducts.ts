import { useState } from 'react'
import { supabase, refreshSchemaCache } from '../lib/supabase'

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
      // Refresh schema cache before operation
      await refreshSchemaCache()
      
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

  return {
    createProduct,
    loading,
    error
  }
}
