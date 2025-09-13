import { useState, useEffect } from 'react'
import { RefreshCw, Database, Trash2 } from 'lucide-react'

export const CacheManager = () => {
  const [cacheSizes, setCacheSizes] = useState<Record<string, number>>({})
  const [isRefreshing, setIsRefreshing] = useState(false)

  const calculateCacheSize = async () => {
    if (!('caches' in window)) return

    const keys = await caches.keys()
    const sizes: Record<string, number> = {}

    for (const key of keys) {
      const cache = await caches.open(key)
      const requests = await cache.keys()
      let totalSize = 0

      for (const request of requests) {
        const response = await cache.match(request)
        if (response) {
          const blob = await response.blob()
          totalSize += blob.size
        }
      }

      sizes[key] = Math.round(totalSize / 1024) // Convert to KB
    }

    setCacheSizes(sizes)
  }

  const refreshCache = async () => {
    setIsRefreshing(true)
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready
        await registration.update()
        console.log('Service Worker updated')
      } catch (error) {
        console.log('Service Worker update failed:', error)
      }
    }
    await calculateCacheSize()
    setIsRefreshing(false)
  }

  const clearCache = async (cacheName: string) => {
    if ('caches' in window) {
      await caches.delete(cacheName)
      await calculateCacheSize()
    }
  }

  const clearAllCaches = async () => {
    if ('caches' in window) {
      const keys = await caches.keys()
      for (const key of keys) {
        await caches.delete(key)
      }
      await calculateCacheSize()
    }
  }

  useEffect(() => {
    calculateCacheSize()
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <Database size={20} />
          <span>Cache Management</span>
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={refreshCache}
            disabled={isRefreshing}
            className="flex items-center space-x-2 bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            onClick={clearAllCaches}
            className="flex items-center space-x-2 bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
          >
            <Trash2 size={16} />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(cacheSizes).map(([name, size]) => (
          <div key={name} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <span className="font-medium">{name}</span>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{size} KB</span>
              <button
                onClick={() => clearCache(name)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        ))}
        {Object.keys(cacheSizes).length === 0 && (
          <p className="text-gray-500 text-center py-4">No caches found</p>
        )}
      </div>
    </div>
  )
}
