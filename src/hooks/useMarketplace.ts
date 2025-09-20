import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface Category {
  id: string
  name: string
  description: string
  created_at: string
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  category_id: string
  condition: string
  location: string
  images: string[]
  video_url?: string
  created_at: string
  category?: Category
}

export const useMarketplace = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('products')
        .select(`
          *,
          category:categories (*)
        `)
        .order('created_at', { ascending: false })

      if (supabaseError) {
        throw new Error(supabaseError.message)
      }

      setProducts(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (supabaseError) {
        throw new Error(supabaseError.message)
      }

      setCategories(data || [])
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  const createProduct = async (productData: Omit<Product, 'id' | 'created_at'>) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('products')
        .insert([{
          title: productData.title,
          description: productData.description,
          price: productData.price,
          category_id: productData.category_id,
          condition: productData.condition,
          location: productData.location,
          images: productData.images,
          video_url: productData.video_url
        }])
        .select()
        .single()

      if (supabaseError) {
        throw new Error(supabaseError.message)
      }

      await fetchProducts() // Refresh the products list
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product')
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  return {
    products,
    categories,
    loading,
    error,
    fetchProducts,
    createProduct
  }
}
