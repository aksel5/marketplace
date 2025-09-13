import { useState, useEffect } from 'react'
import { Wifi, WifiOff } from 'lucide-react'

export const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50">
      <WifiOff size={20} />
      <span>You are offline</span>
    </div>
  )
}

export const OnlineStatusIndicator = () => {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600">
      {isOnline ? (
        <>
          <Wifi size={16} className="text-green-500" />
          <span>Online</span>
        </>
      ) : (
        <>
          <WifiOff size={16} className="text-yellow-500" />
          <span>Offline</span>
        </>
      )}
    </div>
  )
}
