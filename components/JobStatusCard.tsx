'use client'

import { useEffect, useState } from 'react'
import StatusBadge from './StatusBadge'

interface JobStatus {
  status: 'queued' | 'running' | 'completed' | 'failed'
  output: string
  error: string
  pid?: number
  executionTime?: number
  memoryUsed?: number
  queuePosition?: number
  startedAt?: string
  completedAt?: string
  priority: number
  language: string
}

interface JobStatusCardProps {
  jobId: string
}

export default function JobStatusCard({ jobId }: JobStatusCardProps) {
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Create SSE connection
    const eventSource = new EventSource(`/api/status/${jobId}`)

    eventSource.onopen = () => {
      setIsConnected(true)
      console.log('SSE connection opened')
    }

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setJobStatus(data)
      console.log('SSE update:', data)

      // Close connection when job is finished
      if (data.status === 'completed' || data.status === 'failed') {
        eventSource.close()
        setIsConnected(false)
      }
    }

    eventSource.onerror = (error) => {
      console.error('SSE error:', error)
      eventSource.close()
      setIsConnected(false)
    }

    // Cleanup on unmount
    return () => {
      eventSource.close()
      setIsConnected(false)
    }
  }, [jobId])

  if (!jobStatus) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          <p className="text-gray-400">Connecting to job status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Execution Status</h2>
        <div className="flex items-center space-x-2">
          {isConnected && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">Live</span>
            </div>
          )}
          <StatusBadge status={jobStatus.status} />
        </div>
      </div>

      {/* Job Info */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-400">Job ID:</span>
          <p className="text-white font-mono text-xs">{jobId}</p>
        </div>
        <div>
          <span className="text-gray-400">Language:</span>
          <p className="text-white capitalize">{jobStatus.language}</p>
        </div>
        <div>
          <span className="text-gray-400">Priority:</span>
          <p className="text-white">{jobStatus.priority}</p>
        </div>
        {jobStatus.pid && (
          <div>
            <span className="text-gray-400">Process ID:</span>
            <p className="text-white font-mono">{jobStatus.pid}</p>
          </div>
        )}
      </div>

      {/* Status Messages */}
      <div className="mb-4">
        {jobStatus.status === 'queued' && jobStatus.queuePosition && (
          <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-3">
            <p className="text-blue-400">
              ⏳ Queued at position {jobStatus.queuePosition}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Waiting for available worker slot...
            </p>
          </div>
        )}

        {jobStatus.status === 'running' && (
          <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-3">
            <p className="text-yellow-400">
              ⚡ Executing code...
            </p>
            {jobStatus.pid && (
              <p className="text-gray-400 text-sm mt-1">
                Process ID: {jobStatus.pid}
              </p>
            )}
          </div>
        )}

        {jobStatus.status === 'completed' && (
          <div className="bg-green-900/20 border border-green-800 rounded-lg p-3">
            <p className="text-green-400">
              ✓ Execution completed successfully
            </p>
            {jobStatus.executionTime && (
              <p className="text-gray-400 text-sm mt-1">
                Completed in {jobStatus.executionTime}ms
              </p>
            )}
          </div>
        )}

        {jobStatus.status === 'failed' && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
            <p className="text-red-400">
              ✗ Execution failed
            </p>
          </div>
        )}
      </div>

      {/* Output */}
      {jobStatus.output && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Output:</h3>
          <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto text-green-400 font-mono text-sm">
            {jobStatus.output}
          </pre>
        </div>
      )}

      {/* Error */}
      {jobStatus.error && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Error:</h3>
          <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto text-red-400 font-mono text-sm">
            {jobStatus.error}
          </pre>
        </div>
      )}

      {/* Metrics */}
      {(jobStatus.executionTime || jobStatus.memoryUsed) && (
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
          {jobStatus.executionTime && (
            <div>
              <span className="text-gray-400 text-sm">Execution Time:</span>
              <p className="text-white font-semibold">{jobStatus.executionTime}ms</p>
            </div>
          )}
          {jobStatus.memoryUsed && (
            <div>
              <span className="text-gray-400 text-sm">Memory Used:</span>
              <p className="text-white font-semibold">
                {(jobStatus.memoryUsed / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}