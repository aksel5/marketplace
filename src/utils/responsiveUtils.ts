export const breakpoints = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export type Breakpoint = keyof typeof breakpoints

export function getCurrentBreakpoint(): Breakpoint {
  const width = window.innerWidth
  
  if (width < breakpoints.xs) return 'xs'
  if (width < breakpoints.sm) return 'sm'
  if (width < breakpoints.md) return 'md'
  if (width < breakpoints.lg) return 'lg'
  if (width < breakpoints.xl) return 'xl'
  return '2xl'
}

export function isMobile(): boolean {
  return window.innerWidth < breakpoints.md
}

export function isTablet(): boolean {
  return window.innerWidth >= breakpoints.md && window.innerWidth < breakpoints.lg
}

export function isDesktop(): boolean {
  return window.innerWidth >= breakpoints.lg
}

export function optimizeImageForDevice(
  url: string, 
  width: number, 
  quality: number = 80
): string {
  const breakpoint = getCurrentBreakpoint()
  const targetWidth = Math.min(width, breakpoints[breakpoint])
  
  if (url.includes('?')) {
    return `${url}&w=${targetWidth}&q=${quality}`
  }
  return `${url}?w=${targetWidth}&q=${quality}`
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
