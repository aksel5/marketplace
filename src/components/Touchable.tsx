import React from 'react'

interface TouchableProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export default function Touchable({ children, onClick, className = '', disabled = false }: TouchableProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        active:scale-95 transition-transform duration-150
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      style={{
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation'
      }}
    >
      {children}
    </button>
  )
}
