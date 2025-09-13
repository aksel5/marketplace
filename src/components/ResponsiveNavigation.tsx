import React, { useState } from 'react'
import { useMobile } from '../hooks/useMobile'
import Touchable from './Touchable'

interface NavigationItem {
  label: string
  href: string
  icon?: React.ReactNode
}

interface ResponsiveNavigationProps {
  items?: NavigationItem[]
  className?: string
}

export default function ResponsiveNavigation({ items = [], className = '' }: ResponsiveNavigationProps) {
  const isMobile = useMobile()
  const [isOpen, setIsOpen] = useState(false)

  if (isMobile) {
    return (
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-padding ${className}`}>
        <nav className="flex justify-around items-center py-2">
          {items.map((item, index) => (
            <Touchable
              key={index}
              onClick={() => setIsOpen(false)}
              className="flex flex-col items-center p-2 text-xs text-gray-600 hover:text-purple-600 transition-colors"
            >
              {item.icon}
              <span className="mt-1">{item.label}</span>
            </Touchable>
          ))}
        </nav>
      </div>
    )
  }

  return (
    <nav className={`flex space-x-6 ${className}`}>
      {items.map((item, index) => (
        <a
          key={index}
          href={item.href}
          className="text-gray-700 hover:text-purple-600 transition-colors py-2 px-3 rounded-lg hover:bg-gray-100"
        >
          {item.label}
        </a>
      ))}
    </nav>
  )
}
