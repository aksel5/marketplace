import React from 'react'
import { useBreakpoint } from '../hooks/useBreakpoint'

interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
  minItemWidth?: string
}

export default function ResponsiveGrid({ 
  children, 
  className = '', 
  minItemWidth = '250px' 
}: ResponsiveGridProps) {
  const breakpoint = useBreakpoint()

  const getGridColumns = () => {
    switch (breakpoint) {
      case 'xs': return 1
      case 'sm': return 1
      case 'md': return 2
      case 'lg': return 3
      case 'xl': return 4
      case '2xl': return 4
      default: return 2
    }
  }

  return (
    <div
      className={`grid gap-4 ${className}`}
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`,
        gridAutoRows: 'minmax(100px, auto)'
      }}
    >
      {children}
    </div>
  )
}
