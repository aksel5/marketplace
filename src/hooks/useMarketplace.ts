import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export interface Product {
  id: string
  seller_id: string
  category_id: string
  title: string
  description: string
  price: number
  images: string[]
  video_url?: string
  condition: 'new' | 'like_new' | 'used' | 'refurbished'
  status: 'active' | 'sold' | 'draft'
  location: string
  created_at: string
  updated_at: string
  seller?: {
    email: string
    full_name: string
    avatar_url: string
  }
  category?: {
    name: string
    slug: string
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  created_at: string
}

export interface Order {
  id: string
  buyer_id: string
  seller_id: string
  product_id: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  created_at: string
  updated_at: string
  product?: Product
  buyer?: {
    email: string
    full_name: string
  }
}

export function useMarketplace() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [userProducts, setUserProducts] = useState<Product[]>([])
  const [userOrders, setUserOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  const uploadVideo = async (videoBlob: Blob, productId: string): Promise<string> => {
    try {
      const fileName = `products/${productId}/video-${Date.now()}.mp4`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('product-videos')
        .upload(fileName, videoBlob, {
          contentType: 'video/mp4',
          cacheControl: '3600',
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-videos')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (err: any) {
      console.error('Video upload error:', err);
      throw new Error('Failed to upload video');
    }
  };

  const fetchProducts = async (filters?: { category?: string; search?: string }) => {
    try {
      setLoading(true)
      let query = supabase
        .from('products')
        .select(`
          *,
          seller:profiles(email, full_name, avatar_url),
          category:categories(name, slug)
        `)
        .eq('status', 'active')

      if (filters?.category) {
        query = query.eq('category_id', filters.category)
      }

      if (filters?.search) {
        query = query.ilike('title', `%${filters.search}%`)
      }

      const { data, error: fetchError } = await query.order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setProducts(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (fetchError) throw fetchError
      setCategories(data || [])
    } catch (err: any) {
      setError(err.message)
    }
  }

  const fetchUserProducts = async (userId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name, slug)
        `)
        .eq('seller_id', userId)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setUserProducts(data || [])
    } catch (err: any) {
      setError(err.message)
    }
  }

  const fetchUserOrders = async (userId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          product:products(*, seller:profiles(email, full_name))
        `)
        .eq('buyer_id', userId)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setUserOrders(data || [])
    } catch (err: any) {
      setError(err.message)
    }
  }

  const createProduct = async (productData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // First ensure user has a profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert([{
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
            avatar_url: user.user_metadata?.avatar_url || ''
          }])

        if (createProfileError) throw createProfileError
      }

      // Create product without video first
      const { data, error: createError } = await supabase
        .from('products')
        .insert([{ 
          ...productData, 
          seller_id: user.id,
          status: 'active',
          video_url: null
        }])
        .select()
        .single()

      if (createError) throw createError

      // Upload video if provided
      let videoUrl = null;
      if (productData.video) {
        try {
          videoUrl = await uploadVideo(productData.video, data.id);
          // Update product with video URL
          await supabase
            .from('products')
            .update({ video_url: videoUrl })
            .eq('id', data.id);
        } catch (videoError) {
          console.error('Video upload failed, continuing without video:', videoError);
        }
      }

      // Refresh products list
      await fetchProducts()
      return { data: { ...data, video_url: videoUrl }, error: null }
    } catch (err: any) {
      console.error('Error creating product:', err)
      return { data: null, error: err.message }
    }
  }

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('products')
        .update(updates)
        .eq('id', productId)
        .select()
        .single()

      if (updateError) throw updateError
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  const deleteProduct = async (productId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (deleteError) throw deleteError
      return { error: null }
    } catch (err: any) {
      return { error: err.message }
    }
  }

  const createOrder = async (productId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Get product details
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()

      if (productError) throw productError

      // Create order
      const { data, error: orderError } = await supabase
        .from('orders')
        .insert([{
          buyer_id: user.id,
          seller_id: product.seller_id,
          product_id: productId,
          total_amount: product.price,
          status: 'pending'
        }])
        .select()
        .single()

      if (orderError) throw orderError

      // Update product status to sold
      await supabase
        .from('products')
        .update({ status: 'sold' })
        .eq('id', productId)

      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const { data, error: updateError } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .select()
        .single()

      if (updateError) throw updateError
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  return {
    products,
    categories,
    userProducts,
    userOrders,
    loading,
    error,
    fetchProducts,
    fetchCategories,
    fetchUserProducts,
    fetchUserOrders,
    createProduct,
    updateProduct,
    deleteProduct,
    createOrder,
    updateOrderStatus
  }
}
