import React from 'react'
import { useTouchDevice } from '../hooks/useMobile'

interface TouchFormProps {
  children: React.ReactNode
  onSubmit: (e: React.FormEvent) => void
  className?: string
}

export default function TouchForm({ children, onSubmit, className = '' }: TouchFormProps) {
  const isTouchDevice = useTouchDevice()

  return (
    <form
      onSubmit={onSubmit}
      className={`space-y-4 ${isTouchDevice ? 'touch-form' : ''} ${className}`}
      style={{
        WebkitUserSelect: 'none',
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      {children}
    </form>
  )
}
