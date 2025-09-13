import { useEffect } from 'react'

export const useTouchOptimization = () => {
  useEffect(() => {
    // Add touch-specific classes to body
    document.body.classList.add('touch-optimized')
    
    // Prevent double-tap zoom
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
      document.body.classList.remove('touch-optimized')
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])
}

export const useScrollOptimization = () => {
  useEffect(() => {
    // Add smooth scrolling behavior
    const handleScroll = () => {
      // Add custom scroll behavior if needed
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
}

export const useOrientationChange = () => {
  useEffect(() => {
    const handleOrientationChange = () => {
      // Handle orientation change if needed
    }

    window.addEventListener('orientationchange', handleOrientationChange)
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }, [])
}
