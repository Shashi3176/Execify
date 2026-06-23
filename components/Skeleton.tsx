'use client'

import React from 'react'

interface SkeletonProps {
  className?: string
  variant?: 'default' | 'circle' | 'text'
  lines?: number
  animate?: boolean
}

function Skeleton({ className = '', variant = 'default', lines = 1, animate = true }: SkeletonProps) {
  const baseClasses = 'bg-gray-700 rounded'
  const animatedClass = animate ? 'animate-pulse' : ''

  if (variant === 'circle') {
    return <div className={`${baseClasses} ${animatedClass} rounded-full ${className}`} />
  }

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} ${animatedClass} h-4 ${i === lines - 1 ? 'w-3/5' : 'w-full'}`}
          />
        ))}
      </div>
    )
  }

  return <div className={`${baseClasses} ${animatedClass} ${className}`} />
}

interface SkeletonShimmerProps extends SkeletonProps {}

function SkeletonShimmer({ className = '', variant = 'default', lines = 1 }: SkeletonShimmerProps) {
  const shimmerStyle: React.CSSProperties = {
    background: 'linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  }

  if (variant === 'circle') {
    return (
      <>
        <style>{`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
        <div className={`bg-gray-700 rounded ${className}`} style={{ ...shimmerStyle, borderRadius: '9999px' }} />
      </>
    )
  }

  if (variant === 'text' && lines > 1) {
    return (
      <>
        <style>{`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
        <div className={`flex flex-col gap-2 ${className}`}>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-gray-700 rounded"
              style={{
                ...shimmerStyle,
                width: i === lines - 1 ? '60%' : '100%',
              }}
            />
          ))}
        </div>
      </>
    )
  }

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <div className={`bg-gray-700 rounded ${className}`} style={shimmerStyle} />
    </>
  )
}

function JobTableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-800">
      <div className="w-16 h-4 bg-gray-700 rounded animate-pulse" />
      <div className="w-24 h-4 bg-gray-700 rounded animate-pulse" />
      <div className="w-20 h-4 bg-gray-700 rounded animate-pulse" />
      <div className="w-16 h-4 bg-gray-700 rounded animate-pulse" />
      <div className="w-28 h-4 bg-gray-700 rounded animate-pulse" />
      <div className="w-20 h-4 bg-gray-700 rounded animate-pulse" />
      <div className="w-20 h-4 bg-gray-700 rounded animate-pulse" />
    </div>
  )
}

function JobTableSkeleton() {
  return (
    <div>
      {Array.from({ length: 5 }).map((_, i) => (
        <JobTableRowSkeleton key={i} />
      ))}
    </div>
  )
}

function DashboardCardSkeleton() {
  return (
    <div className="bg-gray-900 border border-gray-700/50 rounded-xl p-5 h-32 animate-pulse">
      <div className="w-8 h-8 bg-gray-700 rounded" />
      <div className="w-20 h-8 bg-gray-700 rounded mt-3" />
      <div className="w-24 h-4 bg-gray-700 rounded mt-2" />
    </div>
  )
}

function DashboardGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 7 }).map((_, i) => (
        <DashboardCardSkeleton key={i} />
      ))}
    </div>
  )
}

function PoolStatusSkeleton() {
  return (
    <div className="bg-gray-900 border border-gray-700/50 rounded-xl p-6">
      <div className="h-6 w-32 bg-gray-700 rounded animate-pulse mb-6" />
      <div className="h-16 w-24 bg-gray-700 rounded animate-pulse mx-auto mb-4" />
      <div className="h-3 w-full bg-gray-700 rounded-full animate-pulse mb-6" />
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-3 h-20 animate-pulse" />
        ))}
      </div>
    </div>
  )
}

export { Skeleton, SkeletonShimmer, JobTableRowSkeleton, JobTableSkeleton, DashboardCardSkeleton, DashboardGridSkeleton, PoolStatusSkeleton }
export default Skeleton
