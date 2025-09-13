import { useEffect } from 'react'

export const usePWA = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        console.log('SW ready:', registration)
      })
    }
  }, [])
}

export const checkNetworkStatus = async (): Promise<boolean> => {
  if (navigator.onLine === undefined) {
    return true
  }
  return navigator.onLine
}

export const registerBackgroundSync = async (): Promise<void> => {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const registration = await navigator.serviceWorker.ready
    try {
      await registration.sync.register('background-sync')
      console.log('Background sync registered')
    } catch (error) {
      console.log('Background sync not supported:', error)
    }
  }
}

export const clearOldCaches = async (): Promise<void> => {
  if ('caches' in window) {
    const keys = await caches.keys()
    const currentCache = 'google-fonts-webfonts|google-fonts-stylesheets|supabase-api|images|static-resources|api-cache'
    for (const key of keys) {
      if (!currentCache.includes(key)) {
        await caches.delete(key)
        console.log('Deleted old cache:', key)
      }
    }
  }
}
