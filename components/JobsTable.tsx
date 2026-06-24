"use client"

import { formatRelativeTime, formatExecutionTime, formatMemory, shortenId, getStatusConfig, getLanguageConfig } from '../lib/historyUtils'
import { Job } from '../types'

interface JobsTableProps {
  jobs: Job[];
  onJobClick: (job: Job) => void;
  isLoading: boolean;
  emptyFilter: string;
}

export default function JobsTable({ jobs, onJobClick, isLoading, emptyFilter }: JobsTableProps) {
  if (isLoading) {
    return (
      <div className="overflow-x-auto rounded-xl border border-gray-700/50">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-800/50">
              <th className="text-xs text-gray-500 uppercase tracking-wider px-4 py-3 text-left">Job ID</th>
              <th className="text-xs text-gray-500 uppercase tracking-wider px-4 py-3 text-left">Language</th>
              <th className="text-xs text-gray-500 uppercase tracking-wider px-4 py-3 text-left">Status</th>
              <th className="text-xs text-gray-500 uppercase tracking-wider px-4 py-3 text-left hidden md:table-cell">Priority</th>
              <th className="text-xs text-gray-500 uppercase tracking-wider px-4 py-3 text-left">Submitted</th>
              <th className="text-xs text-gray-500 uppercase tracking-wider px-4 py-3 text-left hidden md:table-cell">Exec Time</th>
              <th className="text-xs text-gray-500 uppercase tracking-wider px-4 py-3 text-left hidden md:table-cell">Memory</th>
              <th className="text-xs text-gray-500 uppercase tracking-wider px-4 py-3 text-left"></th>
            </tr>
          </thead>
          <tbody className="bg-gray-900">
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-800 last:border-0">
                <td className="px-4 py-3"><div className="bg-gray-700 rounded animate-pulse h-4 w-full" /></td>
                <td className="px-4 py-3"><div className="bg-gray-700 rounded animate-pulse h-4 w-full" /></td>
                <td className="px-4 py-3"><div className="bg-gray-700 rounded animate-pulse h-4 w-full" /></td>
                <td className="px-4 py-3 hidden md:table-cell"><div className="bg-gray-700 rounded animate-pulse h-4 w-full" /></td>
                <td className="px-4 py-3"><div className="bg-gray-700 rounded animate-pulse h-4 w-full" /></td>
                <td className="px-4 py-3 hidden md:table-cell"><div className="bg-gray-700 rounded animate-pulse h-4 w-full" /></td>
                <td className="px-4 py-3 hidden md:table-cell"><div className="bg-gray-700 rounded animate-pulse h-4 w-full" /></td>
                <td className="px-4 py-3"><div className="bg-gray-700 rounded animate-pulse h-4 w-full" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (!jobs || jobs.length === 0) {
    const filterLabel = emptyFilter && emptyFilter !== 'all' ? emptyFilter : ''
    const title = filterLabel ? `No ${filterLabel} submissions found` : 'No submissions yet'
    const subtitle = filterLabel
      ? `No ${filterLabel} submissions match your current filter`
      : 'Run some code to see your submission history here'

    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-xl text-gray-400 mb-2">{title}</h3>
        <p className="text-gray-600">{subtitle}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-700/50">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-800/50">
            <th className="text-xs text-gray-500 uppercase tracking-wider px-4 py-3 text-left">Job ID</th>
            <th className="text-xs text-gray-500 uppercase tracking-wider px-4 py-3 text-left">Language</th>
            <th className="text-xs text-gray-500 uppercase tracking-wider px-4 py-3 text-left">Status</th>
            <th className="text-xs text-gray-500 uppercase tracking-wider px-4 py-3 text-left hidden md:table-cell">Priority</th>
            <th className="text-xs text-gray-500 uppercase tracking-wider px-4 py-3 text-left">Submitted</th>
            <th className="text-xs text-gray-500 uppercase tracking-wider px-4 py-3 text-left hidden md:table-cell">Exec Time</th>
            <th className="text-xs text-gray-500 uppercase tracking-wider px-4 py-3 text-left hidden md:table-cell">Memory</th>
            <th className="text-xs text-gray-500 uppercase tracking-wider px-4 py-3 text-left"></th>
          </tr>
        </thead>
        <tbody className="bg-gray-900">
          {jobs.map((job) => {
            const statusConfig = getStatusConfig(job.status)
            const languageConfig = getLanguageConfig(job.language)

            return (
              <tr
                key={job._id}
                onClick={() => onJobClick(job)}
                className="group bg-gray-900 hover:bg-gray-800/70 transition-all duration-150 cursor-pointer border-b border-gray-800 last:border-0"
              >
                <td className="px-4 py-3">
                  <div className="font-mono text-sm text-gray-300">{shortenId(job._id)}</div>
                  {job.queuePosition && (
                    <div className="text-xs text-gray-500">Queue pos: #{job.queuePosition}</div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 border border-current rounded-md px-2 py-0.5 text-xs ${languageConfig.badgeColor}`}
                  >
                    <span>{languageConfig.icon}</span>
                    <span>{languageConfig.label}</span>
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs ${statusConfig.bgColor} ${statusConfig.color}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor} ${job.status === "running" ? "animate-pulse" : ""}`}
                    />
                    <span>{statusConfig.label}</span>
                  </span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="text-sm">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < (job.priority || 0) ? "text-yellow-400" : "text-gray-600"}>
                        {i < (job.priority || 0) ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-300">{formatRelativeTime(job.queuedAt)}</span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="font-mono text-sm text-gray-300">{formatExecutionTime(job.executionTime)}</span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="font-mono text-sm text-gray-300">{formatMemory(job.memoryUsed)}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-gray-600 group-hover:text-gray-300 transition-colors">→</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
