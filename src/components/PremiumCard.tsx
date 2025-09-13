import React from 'react'
import Touchable from './Touchable'

interface PremiumCardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hoverable?: boolean
}

export default function PremiumCard({ 
  children, 
  className = '', 
  onClick, 
  hoverable = true 
}: PremiumCardProps) {
  return (
    <Touchable
      onClick={onClick}
      className={`
        premium-card glass-card premium-transition
        ${hoverable ? 'premium-hover' : ''}
        ${className}
      `}
    >
      {children}
    </Touchable>
  )
}
