import React from 'react'
import { useDeviceDetection } from '../hooks/useDeviceDetection'
import { optimizeImage } from '../utils/responsiveUtils'

interface ImageOptimizerProps {
  src: string
  alt: string
  className?: string
  sizes?: string
  loading?: 'lazy' | 'eager'
  decoding?: 'async' | 'sync' | 'auto'
}

export default function ImageOptimizer({
  src,
  alt,
  className = '',
  sizes = '100vw',
  loading = 'lazy',
  decoding = 'async'
}: ImageOptimizerProps) {
  const device = useDeviceDetection()

  const getOptimizedSrc = () => {
    if (!src) return '/api/placeholder/300/300'
    
    let width = 300
    if (device.isDesktop) width = 400
    if (device.isTablet) width = 350
    if (device.isMobile) width = 300

    return optimizeImage(src, width)
  }

  return (
    <img
      src={getOptimizedSrc()}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      sizes={sizes}
      onError={(e) => {
        // Fallback to placeholder on error
        e.currentTarget.src = '/api/placeholder/300/300'
      }}
    />
  )
}
