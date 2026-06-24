'use client'

import React, { useEffect, useState } from 'react'
import type { Toast, ToastType } from '../hooks/useToast'

interface ToastProps {
  toast: Toast
  onDismiss: (id: string) => void
}

const CONFIG: Record<ToastType, { icon: string; bg: string; border: string; text: string; iconBg: string; progressBg: string }> = {
  success: { icon: '✓', bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', iconBg: 'bg-green-500/20', progressBg: 'bg-green-400' },
  error: { icon: '✕', bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', iconBg: 'bg-red-500/20', progressBg: 'bg-red-400' },
  info: { icon: 'ℹ', bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', iconBg: 'bg-blue-500/20', progressBg: 'bg-blue-400' },
  warning: { icon: '⚠', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', iconBg: 'bg-yellow-500/20', progressBg: 'bg-yellow-400' },
}

function Toast({ toast, onDismiss }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const config = CONFIG[toast.type]

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  const handleDismiss = () => {
    setIsLeaving(true)
    setTimeout(() => onDismiss(toast.id), 300)
  }

  return (
    <>
      <style>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
      <div
        className={`
          flex items-start gap-3
          ${config.bg} ${config.border} border rounded-xl
          px-4 py-3 shadow-xl shadow-black/30
          min-w-[280px] max-w-[400px]
          relative overflow-hidden
          transition-all duration-300
          ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        `}
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.iconBg}`}>
          <span className="text-lg">{config.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${config.text}`}>{toast.message}</p>
          <p className="text-xs text-gray-500 capitalize mt-0.5">{toast.type}</p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-500 hover:text-gray-300 flex-shrink-0 text-lg transition-colors"
        >
          ×
        </button>
        <div
          className={`absolute bottom-0 left-0 h-0.5 rounded-full ${config.progressBg}`}
          style={{ animation: `progress ${toast.duration ?? 3000}ms linear forwards` }}
        />
      </div>
    </>
  )
}

export default Toast
