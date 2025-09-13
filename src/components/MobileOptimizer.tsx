import React, { useEffect } from 'react'
import { useDeviceDetection } from '../hooks/useDeviceDetection'
import { optimizeForMobile, lazyLoadImages, preventZoom } from '../utils/mobileOptimization'

export default function MobileOptimizer() {
  const device = useDeviceDetection()

  useEffect(() => {
    // Run mobile optimizations
    optimizeForMobile()
    
    // Set up lazy loading
    lazyLoadImages()
    
    // Prevent zoom on mobile
    const cleanup = preventZoom()
    
    return () => {
      cleanup?.()
    }
  }, [])

  useEffect(() => {
    // Add device-specific classes to body
    if (device.isMobile) {
      document.body.classList.add('is-mobile')
      document.body.classList.remove('is-tablet', 'is-desktop')
    } else if (device.isTablet) {
      document.body.classList.add('is-tablet')
      document.body.classList.remove('is-mobile', 'is-desktop')
    } else {
      document.body.classList.add('is-desktop')
      document.body.classList.remove('is-mobile', 'is-tablet')
    }

    // Add orientation class
    document.body.classList.toggle('is-portrait', device.orientation === 'portrait')
    document.body.classList.toggle('is-landscape', device.orientation === 'landscape')
  }, [device.isMobile, device.isTablet, device.isDesktop, device.orientation])

  // Add viewport meta tag dynamically for better control
  useEffect(() => {
    const viewportMeta = document.querySelector('meta[name="viewport"]')
    if (viewportMeta) {
      let content = 'width=device-width, initial-scale=1'
      
      if (device.isMobile) {
        content += ', maximum-scale=1.0, user-scalable=no'
      }
      
      viewportMeta.setAttribute('content', content)
    }
  }, [device.isMobile])

  return null
}
