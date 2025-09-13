import React, { useState, useMemo } from 'react'
import { useBreakpoint } from '../hooks/useBreakpoint'

interface PerformanceOptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  loading?: 'eager' | 'lazy'
  quality?: number
}

export default function PerformanceOptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  quality = 80
}: PerformanceOptimizedImageProps) {
  const breakpoint = useBreakpoint()
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const optimizedSrc = useMemo(() => {
    if (hasError) return src
    
    const breakpointWidths = {
      xs: Math.min(width, 400),
      sm: Math.min(width, 600),
      md: Math.min(width, 800),
      lg: Math.min(width, 1000),
      xl: Math.min(width, 1200),
      '2xl': width
    }

    const targetWidth = breakpointWidths[breakpoint]
    
    if (src.includes('?')) {
      return `${src}&w=${targetWidth}&q=${quality}&format=auto`
    }
    return `${src}?w=${targetWidth}&q=${quality}&format=auto`
  }, [src, width, breakpoint, quality, hasError])

  const aspectRatio = (height / width) * 100

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ paddingBottom: `${aspectRatio}%` }}
    >
      <img
        src={optimizedSrc}
        alt={alt}
        loading={loading}
        decoding="async"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        style={{
          contentVisibility: 'auto',
        }}
      />
      
      {/* Loading skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  )
}
