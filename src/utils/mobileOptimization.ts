export const optimizeForMobile = () => {
  // Add mobile-specific optimizations
  if (typeof window !== 'undefined') {
    const isMobile = window.innerWidth < 768
    
    if (isMobile) {
      // Mobile-specific optimizations
      document.documentElement.style.setProperty('--scroll-padding', 'env(safe-area-inset-top)')
    }
  }
}

export const getDevicePixelRatio = (): number => {
  if (typeof window !== 'undefined') {
    return window.devicePixelRatio || 1
  }
  return 1
}

export const isHighDensityScreen = (): boolean => {
  return getDevicePixelRatio() >= 2
}

export const getViewportSize = (): { width: number; height: number } => {
  if (typeof window !== 'undefined') {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }
  return { width: 0, height: 0 }
}

export const isInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

export const scrollToElement = (element: HTMLElement, behavior: ScrollBehavior = 'smooth') => {
  element.scrollIntoView({
    behavior,
    block: 'start',
    inline: 'nearest'
  })
}

export const preventZoom = () => {
  if (typeof window !== 'undefined') {
    // Prevent zoom on double-tap
    let lastTouchEnd = 0
    const handleTouchEnd = (event: TouchEvent) => {
      const now = Date.now()
      if (now - lastTouchEnd <= 300) {
        event.preventDefault()
      }
      lastTouchEnd = now
    }

    document.addEventListener('touchend', handleTouchEnd, { passive: false })
    
    return () => {
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }
}

export const optimizeImagesForDevice = (imageUrl: string, width: number): string => {
  if (!imageUrl) return ''
  
  const dpr = getDevicePixelRatio()
  const optimizedWidth = Math.round(width * dpr)
  
  // Add image optimization parameters
  const url = new URL(imageUrl)
  url.searchParams.set('w', optimizedWidth.toString())
  url.searchParams.set('q', '80')
  url.searchParams.set('fit', 'crop')
  
  return url.toString()
}

export const lazyLoadImages = () => {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]')
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          img.src = img.dataset.src || ''
          img.removeAttribute('data-src')
          imageObserver.unobserve(img)
        }
      })
    })

    lazyImages.forEach((img) => imageObserver.observe(img))
  }
}
