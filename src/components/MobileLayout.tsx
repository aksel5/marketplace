import React from 'react'
import { useMobile } from '../hooks/useMobile'

interface MobileLayoutProps {
  children: React.ReactNode
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const isMobile = useMobile()

  return (
    <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pb-20' : ''}`}>
      {children}
    </div>
  )
}
