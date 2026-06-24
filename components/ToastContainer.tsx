'use client'

import React from 'react'
import { useToast } from '../hooks/useToast'
import Toast from './Toast'

export default function ToastContainer() {
  const { toasts, dismissToast, dismissAll } = useToast()
  const visibleToasts = toasts.slice(-5)

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 items-end pointer-events-none">
      {toasts.length > 1 && (
        <button
          onClick={dismissAll}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors pointer-events-auto"
        >
          Clear all
        </button>
      )}
      {visibleToasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} onDismiss={dismissToast} />
        </div>
      ))}
    </div>
  )
}
