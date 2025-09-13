import React from 'react'
import Touchable from './Touchable'

interface EnhancedButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
  icon?: React.ReactNode
}

export default function EnhancedButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  icon
}: EnhancedButtonProps) {
  const baseStyles = `
    premium-button premium-transition premium-tap
    rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `

  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-white text-gray-900 border border-gray-200 shadow-md hover:shadow-lg hover:border-gray-300',
    ghost: 'bg-transparent text-purple-600 hover:bg-purple-50'
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  return (
    <Touchable
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      <div className="flex items-center justify-center space-x-2">
        {icon && <span className="premium-icon">{icon}</span>}
        <span>{children}</span>
      </div>
    </Touchable>
  )
}
