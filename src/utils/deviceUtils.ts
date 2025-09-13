export const DeviceUtils = {
  isIOS: (): boolean => {
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.platform) ||
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  },

  isAndroid: (): boolean => {
    return navigator.userAgent.includes('Android')
  },

  isSafari: (): boolean => {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  },

  isChrome: (): boolean => {
    return /chrome|chromium|crios/i.test(navigator.userAgent)
  },

  getPixelRatio: (): number => {
    return window.devicePixelRatio || 1
  },

  supportsWebP: (): Promise<boolean> => {
    return new Promise((resolve) => {
      const webP = new Image()
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2)
      }
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
    })
  },

  getNetworkType(): Promise<'slow-2g' | '2g' | '3g' | '4g'> {
    // @ts-ignore
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    
    if (connection) {
      return Promise.resolve(connection.effectiveType)
    }
    
    return Promise.resolve('4g') // Assume good connection if API not available
  }
}

export class ViewportManager {
  static lockOrientation(orientation: 'portrait' | 'landscape'): void {
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock(orientation)
    }
  }

  static unlockOrientation(): void {
    if (screen.orientation && screen.orientation.unlock) {
      screen.orientation.unlock()
    }
  }

  static getOrientation(): 'portrait' | 'landscape' {
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
  }

  static addOrientationChangeListener(callback: (orientation: string) => void): () => void {
    const handler = () => callback(this.getOrientation())
    window.addEventListener('orientationchange', handler)
    
    return () => window.removeEventListener('orientationchange', handler)
  }
}
