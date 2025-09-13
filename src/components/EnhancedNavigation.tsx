import React, { useState } from 'react'
import { useMobile } from '../hooks/useMobile'
import Touchable from './Touchable'

interface NavigationItem {
  label: string
  href: string
  icon: React.ReactNode
  active?: boolean
}

interface EnhancedNavigationProps {
  items: NavigationItem[]
  className?: string
}

export default function EnhancedNavigation({ items, className = '' }: EnhancedNavigationProps) {
  const isMobile = useMobile()
  const [activeItem, setActiveItem] = useState(0)

  if (isMobile) {
    return (
      <div className={`mobile-nav-enhanced fixed bottom-0 left-0 right-0 z-50 ${className}`}>
        <nav className="flex justify-around items-center py-3 px-4">
          {items.map((item, index) => (
            <Touchable
              key={index}
              onClick={() => setActiveItem(index)}
              className={`flex flex-col items-center p-3 rounded-2xl premium-transition ${
                activeItem === index 
                  ? 'mobile-nav-item active text-white' 
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <div className={`premium-icon ${activeItem === index ? 'text-white' : ''}`}>
                {item.icon}
              </div>
              <span className="text-xs font-medium mt-1">{item.label}</span>
            </Touchable>
          ))}
        </nav>
      </div>
    )
  }

  return (
    <nav className={`flex space-x-2 bg-white rounded-2xl p-2 shadow-lg ${className}`}>
      {items.map((item, index) => (
        <Touchable
          key={index}
          onClick={() => setActiveItem(index)}
          className={`flex items-center px-4 py-3 rounded-xl premium-transition ${
            activeItem === index
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
              : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
          }`}
        >
          <div className="mr-2 premium-icon">{item.icon}</div>
          <span className="font-medium">{item.label}</span>
        </Touchable>
      ))}
    </nav>
  )
}
