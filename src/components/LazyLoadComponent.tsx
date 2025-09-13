import React, { useState, useEffect, useRef } from 'react'

interface LazyLoadComponentProps {
  children: React.ReactNode
  threshold?: number
  rootMargin?: string
  className?: string
}

export default function LazyLoadComponent({ 
  children, 
  threshold = 0.1, 
  rootMargin = '100px', 
  className = '' 
}: LazyLoadComponentProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : (
        <div className="loading-skeleton rounded-lg h-32" />
      )}
    </div>
  )
}
