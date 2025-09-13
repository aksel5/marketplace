import React from 'react'
import { useMobile } from '../hooks/useMobile'
import Touchable from './Touchable'

interface AdaptiveModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export default function AdaptiveModal({ isOpen, onClose, children, title }: AdaptiveModalProps) {
  const isMobile = useMobile()

  if (!isOpen) return null

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
        <div 
          className="bg-white rounded-t-2xl w-full max-h-[90vh] overflow-hidden"
          style={{
            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold">{title}</h3>
            <Touchable onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </Touchable>
          </div>
          <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
            {children}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Touchable onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </Touchable>
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  )
}
