import React from 'react'
import { useMobile } from '../hooks/useMobile'

interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
}

export default function ResponsiveContainer({ children, className = '' }: ResponsiveContainerProps) {
  const isMobile = useMobile()
  
  return (
    <div className={`
      mx-auto w-full
      ${isMobile ? 'px-4 max-w-full' : 'px-6 max-w-7xl'}
      ${className}
    `}>
      {children}
    </div>
  )
}
