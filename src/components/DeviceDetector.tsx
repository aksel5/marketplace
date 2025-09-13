import React from 'react'
import { useBreakpoint, useMobile, useTouchDevice } from '../hooks/useMobile'

interface DeviceDetectorProps {
  children: (props: {
    isMobile: boolean
    isTablet: boolean
    isDesktop: boolean
    isTouchDevice: boolean
    breakpoint: ReturnType<typeof useBreakpoint>
  }) => React.ReactNode
}

export default function DeviceDetector({ children }: DeviceDetectorProps) {
  const isMobileDevice = useMobile()
  const isTouchDevice = useTouchDevice()
  const breakpoint = useBreakpoint()
  
  const isTablet = breakpoint === 'md' || breakpoint === 'lg'
  const isDesktop = breakpoint === 'xl' || breakpoint === '2xl'
  
  return (
    <>
      {children({
        isMobile: isMobileDevice,
        isTablet,
        isDesktop,
        isTouchDevice,
        breakpoint
      })}
    </>
  )
}
