import React from 'react'

interface EnhancedInputProps {
  type?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
  icon?: React.ReactNode
}

export default function EnhancedInput({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  icon
}: EnhancedInputProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`
          premium-input w-full premium-transition
          ${icon ? 'pl-12 pr-4' : 'px-4'}
          ${className}
        `}
        style={{
          minHeight: '48px'
        }}
      />
    </div>
  )
}
