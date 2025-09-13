import { ReactNode } from 'react'
import { useNetworkStatus } from '../hooks/useNetworkStatus'

interface OfflineFallbackProps {
  children: ReactNode
  fallback?: ReactNode
}

export const OfflineFallback = ({ children, fallback }: OfflineFallbackProps) => {
  const isOnline = useNetworkStatus()

  if (!isOnline) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-yellow-100 rounded-full p-4 inline-flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">You're Offline</h2>
          <p className="text-gray-600 mb-4">Some features may not be available while you're offline.</p>
          <div className="animate-pulse bg-gray-200 h-4 rounded w-32 mx-auto"></div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export const useNetworkStatus = (): boolean => {
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

  return isOnline
}
