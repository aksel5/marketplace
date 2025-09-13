import React from 'react'
import { ShoppingBag, Heart, Eye } from 'lucide-react'

interface Product {
  id: string
  title: string
  description: string
  price: number
  image_url: string
  category_id: string
  created_at: string
  seller_id: string
  status: 'available' | 'sold'
}

interface ResponsiveProductCardProps {
  product: Product
  onBuy: (productId: string) => void
  showActions: boolean
}

export default function ResponsiveProductCard({ product, onBuy, showActions }: ResponsiveProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image_url || '/api/placeholder/300/300'}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        
        {/* Status Badge */}
        {product.status === 'sold' && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Sold
          </div>
        )}
        
        {/* Quick Actions */}
        <div className="absolute top-3 left-3 flex space-x-2">
          <button className="bg-white bg-opacity-90 p-2 rounded-full shadow-sm hover:bg-opacity-100 transition-all btn-touch">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
          <button className="bg-white bg-opacity-90 p-2 rounded-full shadow-sm hover:bg-opacity-100 transition-all btn-touch">
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 fluid-text">
          {product.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-purple-600">
            {formatPrice(product.price)}
          </span>
          
          {showActions && product.status === 'available' && (
            <button
              onClick={() => onBuy(product.id)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all btn-touch min-w-[100px]"
            >
              Buy Now
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
