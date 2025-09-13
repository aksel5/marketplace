import React from 'react'
import { useMobile } from '../hooks/useMobile'

interface EnhancedMobileLayoutProps {
  children: React.ReactNode
  className?: string
}

export default function EnhancedMobileLayout({ children, className = '' }: EnhancedMobileLayoutProps) {
  const isMobile = useMobile()

  return (
    <div className={`
      min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50
      ${isMobile ? 'pb-20 safe-area-inset-bottom' : ''}
      ${className}
    `}>
      <div className="max-w-md mx-auto">
        {children}
      </div>
    </div>
  )
}
