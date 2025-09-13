import React from 'react'
import { Heart, ShoppingCart, MapPin, Star } from 'lucide-react'
import type { Product } from '../hooks/useMarketplace'

interface ProductCardProps {
  product: Product
  onBuy?: (productId: string) => void
  showActions?: boolean
}

export default function ProductCard({ product, onBuy, showActions = true }: ProductCardProps) {
  const conditionLabels = {
    new: 'Brand New',
    like_new: 'Like New',
    used: 'Used',
    refurbished: 'Refurbished'
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.images[0] || 'https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <button className="p-2 bg-white bg-opacity-90 rounded-full shadow-md hover:bg-opacity-100 transition-colors">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded-full">
            {product.category?.name}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
          {product.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Condition and Location */}
        <div className="flex items-center justify-between mb-4">
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
            {conditionLabels[product.condition]}
          </span>
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="w-3 h-3 mr-1" />
            {product.location}
          </div>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-purple-600">{formatPrice(product.price)}</p>
            {product.seller && (
              <p className="text-sm text-gray-500">by {product.seller.full_name}</p>
            )}
          </div>

          {showActions && onBuy && (
            <button
              onClick={() => onBuy(product.id)}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Buy Now</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
