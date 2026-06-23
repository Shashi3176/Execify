'use client'

import { useEffect, useState } from 'react'
import { NextResponse } from 'next/server'
import {
  formatRelativeTime,
  formatExecutionTime,
  formatMemory,
  shortenId,
  getStatusConfig,
  getLanguageConfig,
} from '@/lib/historyUtils'

export default function JobDetailModal({ job, onClose, isOpen }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const handleCopy = async () => {
    if (!job?.code) return
    await navigator.clipboard.writeText(job.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderStars = (priority) => {
    const safePriority = Math.max(1, Math.min(5, Number(priority) || 1))
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < safePriority ? 'text-yellow-400' : 'text-gray-600'}>
        ★
      </span>
    ))
  }

  if (!isOpen || !job) return null

  const statusConfig = getStatusConfig(job.status)
  const languageConfig = getLanguageConfig(job.language)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl border border-gray-700 bg-gray-900 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Job Details</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="text-sm text-gray-400 font-mono">{job._id}</span>
          <span className={`rounded-md border px-2.5 py-0.5 text-xs font-medium ${languageConfig.badgeColor}`}>
            {languageConfig.icon} {languageConfig.label}
          </span>
          <span className={`flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dotColor}`}></span>
            {statusConfig.label}
          </span>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-lg bg-gray-800 p-3">
            <span className="block text-xs text-gray-400">Queued At</span>
            <span className="text-sm text-white">{formatRelativeTime(job.queuedAt)}</span>
          </div>
          <div className="rounded-lg bg-gray-800 p-3">
            <span className="block text-xs text-gray-400">Started At</span>
            <span className="text-sm text-white">{formatRelativeTime(job.startedAt)}</span>
          </div>
          <div className="rounded-lg bg-gray-800 p-3">
            <span className="block text-xs text-gray-400">Completed At</span>
            <span className="text-sm text-white">{formatRelativeTime(job.completedAt)}</span>
          </div>
          <div className="rounded-lg bg-gray-800 p-3">
            <span className="block text-xs text-gray-400">Execution Time</span>
            <span className="text-sm text-white">{formatExecutionTime(job.executionTime)}</span>
          </div>
          <div className="rounded-lg bg-gray-800 p-3">
            <span className="block text-xs text-gray-400">Memory Used</span>
            <span className="text-sm text-white">{formatMemory(job.memoryUsed)}</span>
          </div>
          <div className="rounded-lg bg-gray-800 p-3">
            <span className="block text-xs text-gray-400">Priority</span>
            <span className="text-sm text-white">{renderStars(job.priority)}</span>
          </div>
          <div className="rounded-lg bg-gray-800 p-3">
            <span className="block text-xs text-gray-400">PID</span>
            <span className="text-sm text-white">{job.pid ?? '—'}</span>
          </div>
          <div className="rounded-lg bg-gray-800 p-3">
            <span className="block text-xs text-gray-400">Queue Position</span>
            <span className="text-sm text-white">{job.queuePosition ?? '—'}</span>
          </div>
        </div>

        <div className="mb-6">
          <div className="mb-2 text-sm font-medium text-gray-300">Source Code</div>
          <div className="relative rounded-lg bg-gray-950 p-4">
            <button
              onClick={handleCopy}
              className="absolute right-2 top-2 rounded-md border border-gray-700 bg-gray-800 px-3 py-1 text-xs text-gray-300 hover:bg-gray-700"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <pre className="overflow-x-auto text-sm text-gray-300">
              <code>{job.code}</code>
            </pre>
          </div>
        </div>

        {job.output && (
          <div className="mb-6">
            <div className="mb-2 text-sm font-medium text-gray-300">Output</div>
            <div className="rounded-lg bg-gray-800 p-4">
              <pre className="whitespace-pre-wrap text-sm text-green-400">{job.output}</pre>
            </div>
          </div>
        )}

        {job.error && (
          <div className="mb-6">
            <div className="mb-2 text-sm font-medium text-gray-300">Error</div>
            <div className="rounded-lg border border-red-800 bg-red-950/50 p-4">
              <pre className="whitespace-pre-wrap text-sm text-red-400">{job.error}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
