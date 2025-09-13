import React, { useState, useEffect } from 'react'
import { X, Upload, Image, Video, AlertCircle } from 'lucide-react'
import type { Category } from '../hooks/useMarketplace'
import VideoUpload from './VideoUpload'

interface ProductFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  categories?: Category[]
  initialData?: any
  isEditing?: boolean
}

export default function ProductForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  categories = [], 
  initialData, 
  isEditing = false 
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category_id: '',
    condition: 'used',
    location: '',
    images: [] as string[],
    video: null as Blob | null
  })
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [showVideoUpload, setShowVideoUpload] = useState(false)
  const [videoError, setVideoError] = useState<string>('')

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price?.toString() || '',
        category_id: initialData.category_id || '',
        condition: initialData.condition || 'used',
        location: initialData.location || '',
        images: initialData.images || [],
        video: null
      })
      setImageUrls(initialData.images || [])
      setVideoUrl(initialData.video_url || '')
    } else {
      setFormData({
        title: '',
        description: '',
        price: '',
        category_id: '',
        condition: 'used',
        location: '',
        images: [],
        video: null
      })
      setImageUrls([])
      setVideoUrl('')
    }
    setVideoError('')
  }, [initialData, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setVideoError('')

    try {
      const productData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category_id: formData.category_id,
        condition: formData.condition,
        location: formData.location,
        images: imageUrls,
        video: formData.video
      }

      await onSubmit(productData)
      onClose()
    } catch (error: any) {
      console.error('Error submitting form:', error)
      setVideoError(error.message || 'Failed to submit product')
    } finally {
      setLoading(false)
    }
  }

  const handleImageAdd = () => {
    const url = prompt('Enter image URL:')
    if (url && url.trim()) {
      setImageUrls(prev => [...prev, url.trim()])
    }
  }

  const handleImageRemove = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleVideoUpload = (videoBlob: Blob) => {
    setFormData(prev => ({ ...prev, video: videoBlob }))
    setVideoUrl(URL.createObjectURL(videoBlob))
    setShowVideoUpload(false)
    setVideoError('')
  }

  const handleVideoRemove = () => {
    setFormData(prev => ({ ...prev, video: null }))
    setVideoUrl('')
    setVideoError('')
  }

  const handleVideoUploadError = (error: string) => {
    setVideoError(error)
    setShowVideoUpload(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Product' : 'List New Product'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter product title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Describe your product in detail..."
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price ($) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              required
              value={formData.category_id}
              onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories?.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condition *
            </label>
            <select
              required
              value={formData.condition}
              onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="new">Brand New</option>
              <option value="like_new">Like New</option>
              <option value="used">Used</option>
              <option value="refurbished">Refurbished</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="City, State"
            />
          </div>

          {/* Video Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Video (15s max)
            </label>
            
            {videoError && (
              <div className="mb-3 bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <p className="text-red-800 text-sm">{videoError}</p>
                </div>
              </div>
            )}
            
            {showVideoUpload ? (
              <VideoUpload 
                onVideoUpload={handleVideoUpload}
                maxDuration={15}
              />
            ) : videoUrl ? (
              <div className="relative">
                <video
                  src={videoUrl}
                  controls
                  className="w-full rounded-lg border border-gray-200"
                  style={{ maxHeight: '200px' }}
                />
                <button
                  type="button"
                  onClick={handleVideoRemove}
                  className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowVideoUpload(true)}
                className="flex items-center space-x-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-colors"
              >
                <Video className="w-4 h-4" />
                <span>Add Product Video</span>
              </button>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images
            </label>
            <div className="space-y-3">
              {imageUrls.map((url, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={url}
                    alt={`Product ${index + 1}`}
                    className="w-12 h-12 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg'
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600 truncate">{url}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleImageRemove(index)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={handleImageAdd}
                className="flex items-center space-x-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Add Image URL</span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg disabled:opacity-50 transition-all"
            >
              {loading ? 'Saving...' : isEditing ? 'Update Product' : 'List Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
