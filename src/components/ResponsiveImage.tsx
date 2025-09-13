import React from 'react'
import { useBreakpoint } from '../hooks/useBreakpoint'

interface ResponsiveImageProps {
  src: string
  alt: string
  mobileSrc?: string
  tabletSrc?: string
  className?: string
  sizes?: string
}

export default function ResponsiveImage({ 
  src, 
  alt, 
  mobileSrc, 
  tabletSrc, 
  className = '', 
  sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 60vw'
}: ResponsiveImageProps) {
  const breakpoint = useBreakpoint()
  
  const getSource = () => {
    if (breakpoint === 'xs' || breakpoint === 'sm') return mobileSrc || src
    if (breakpoint === 'md') return tabletSrc || src
    return src
  }

  return (
    <img
      src={getSource()}
      alt={alt}
      className={`object-cover w-full h-auto ${className}`}
      sizes={sizes}
      loading="lazy"
      decoding="async"
    />
  )
}
