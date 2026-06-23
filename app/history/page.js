"use client"

import { useState, useEffect, useCallback } from 'react'
import JobsTable from '@/components/JobsTable'
import HistoryFilterBar from '@/components/HistoryFilterBar'
import JobDetailModal from '@/components/JobDetailModal'

export default function HistoryPage() {
  const [jobs, setJobs] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [activeFilter, setActiveFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(null)
  const [totalCounts, setTotalCounts] = useState({ all: 0, queued: 0, running: 0, completed: 0, failed: 0 })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [, forceUpdate] = useState(0)

  const fetchJobs = useCallback(async (filterOverride, pageOverride, append) => {
    const effectiveFilter = filterOverride ?? activeFilter
    const effectivePage = pageOverride ?? page

    if (append) {
      setIsLoadingMore(true)
    } else {
      setIsLoading(true)
    }

    try {
      const params = new URLSearchParams({ page: String(effectivePage), limit: '20' })
      if (effectiveFilter !== 'all') {
        params.set('status', effectiveFilter)
      }

      const res = await fetch(`/api/jobs?${params}`)
      const data = await res.json()

      if (append) {
        setJobs((prev) => [...prev, ...data.jobs])
      } else {
        setJobs(data.jobs)
      }

      setTotal(data.total)
      setTotalPages(data.totalPages)
      setLastRefresh(new Date())
      setError(null)
    } catch (err) {
      setError('Failed to load submissions. Retrying...')
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }, [activeFilter, page])

  const fetchCounts = useCallback(async () => {
    try {
      const [r0, r1, r2, r3, r4] = await Promise.all([
        fetch('/api/jobs?limit=1').then((r) => r.json()),
        fetch('/api/jobs?limit=1&status=queued').then((r) => r.json()),
        fetch('/api/jobs?limit=1&status=running').then((r) => r.json()),
        fetch('/api/jobs?limit=1&status=completed').then((r) => r.json()),
        fetch('/api/jobs?limit=1&status=failed').then((r) => r.json()),
      ])

      setTotalCounts({
        all: r0.total,
        queued: r1.total,
        running: r2.total,
        completed: r3.total,
        failed: r4.total,
      })
    } catch (err) {
      console.error('Failed to fetch counts:', err)
    }
  }, [])

  useEffect(() => {
    fetchJobs()
    fetchCounts()

    const interval = setInterval(() => {
      fetchJobs()
      fetchCounts()
    }, 5000)

    return () => clearInterval(interval)
  }, [fetchJobs, fetchCounts])

  useEffect(() => {
    const timer = setInterval(() => {
      forceUpdate((n) => n + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    setPage(1)
    fetchJobs(activeFilter, 1, false)
  }, [activeFilter, fetchJobs])

  const handleFilterChange = useCallback((newFilter) => {
    setActiveFilter(newFilter)
  }, [])

  const handleJobClick = useCallback((job) => {
    setSelectedJob(job)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedJob(null), 300)
  }, [])

  const handleLoadMore = useCallback(() => {
    fetchJobs(activeFilter, page + 1, true)
    setPage((p) => p + 1)
  }, [activeFilter, page, fetchJobs])

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    await Promise.all([fetchJobs(), fetchCounts()])
    setIsRefreshing(false)
  }, [fetchJobs, fetchCounts])

  const getSecondsAgo = () => {
    if (!lastRefresh) return null
    return Math.floor((new Date() - lastRefresh) / 1000)
  }

  const secondsAgo = getSecondsAgo()
  const refreshLabel = secondsAgo === null
    ? 'Never refreshed'
    : secondsAgo < 5
      ? 'Updated just now'
      : `Updated ${secondsAgo}s ago`

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-8 pb-4 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Submission History</h1>
            <p className="text-gray-500 text-sm mt-1">Track all your code executions</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{refreshLabel}</span>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className={`p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
            >
              <span className="text-lg">🔄</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => {
                setError(null)
                fetchJobs()
              }}
              className="ml-4 px-3 py-1 bg-red-800/50 hover:bg-red-700/50 rounded text-red-300 text-xs font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        <HistoryFilterBar activeFilter={activeFilter} onFilterChange={handleFilterChange} totalCounts={totalCounts} />

        <div className="py-6">
          <JobsTable jobs={jobs} onJobClick={handleJobClick} isLoading={isLoading} emptyFilter={activeFilter} />
        </div>

        {page < totalPages && (
          <div className="pb-12">
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingMore ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Loading...
                  </span>
                ) : (
                  'Load More'
                )}
              </button>
              <p className="text-gray-600 text-sm text-center">
                Showing {jobs.length} of {total} submissions
              </p>
            </div>
          </div>
        )}
      </div>

      <JobDetailModal job={selectedJob} onClose={handleCloseModal} isOpen={isModalOpen} />
    </div>
  )
}
