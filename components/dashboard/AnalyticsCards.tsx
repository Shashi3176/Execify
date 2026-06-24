'use client';

import { formatExecutionTime, formatMemory, formatWaitTime, formatSuccessRate } from '../../lib/dashboardUtils';

interface Analytics {
  totalSubmissions: number;
  completed: number;
  failed: number;
  successRate: number;
  avgExecutionTime: number;
  avgMemoryUsed: number;
  avgQueueWaitTime: number;
}

interface AnalyticsCardsProps {
  analytics: Analytics | null;
  isLoading: boolean;
}

function SkeletonCard() {
  return (
    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50 animate-pulse">
      <div className="flex items-center space-x-2 mb-2">
        <div className="w-5 h-5 bg-gray-700 rounded" />
        <div className="h-3 bg-gray-700 rounded w-20" />
      </div>
      <div className="h-7 bg-gray-700 rounded w-12 mb-1" />
      <div className="h-3 bg-gray-700 rounded w-16" />
    </div>
  );
}

export default function AnalyticsCards({ analytics, isLoading }: AnalyticsCardsProps) {
  if (isLoading && !analytics) {
    return (
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Analytics Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (analytics && analytics.totalSubmissions === 0) {
    return (
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Analytics Overview</h2>
        <div className="bg-gray-900/50 rounded-lg p-8 border border-gray-800/50 text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-gray-300 font-medium">No data yet</p>
          <p className="text-gray-500 text-sm mt-1">Submit some jobs to see analytics here</p>
        </div>
      </section>
    );
  }

  if (!analytics) return null;

  const successRateInfo = formatSuccessRate(analytics.successRate);

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-white mb-4">Analytics Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50 hover:border-gray-700 transition-colors">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-base">📥</span>
            <span className="text-xs text-gray-400">Total Submissions</span>
          </div>
          <p className="text-2xl font-bold text-white">{analytics.totalSubmissions}</p>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50 hover:border-gray-700 transition-colors">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-base">✓</span>
            <span className="text-xs text-gray-400">Completed</span>
          </div>
          <p className="text-2xl font-bold text-white">{analytics.completed}</p>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50 hover:border-gray-700 transition-colors">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-base">✗</span>
            <span className="text-xs text-gray-400">Failed</span>
          </div>
          <p className="text-2xl font-bold text-white">{analytics.failed}</p>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50 hover:border-gray-700 transition-colors">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-base">📈</span>
            <span className="text-xs text-gray-400">Success Rate</span>
          </div>
          <p className={`text-2xl font-bold ${successRateInfo.colorClass}`}>{successRateInfo.text}</p>
          <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${successRateInfo.colorClass.replace('text-', 'bg-')} transition-all`}
              style={{ width: successRateInfo.text }}
            />
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50 hover:border-gray-700 transition-colors">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-base">⚡</span>
            <span className="text-xs text-gray-400">Avg Execution Time</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatExecutionTime(analytics.avgExecutionTime)}</p>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50 hover:border-gray-700 transition-colors">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-base">💾</span>
            <span className="text-xs text-gray-400">Avg Memory Used</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatMemory(analytics.avgMemoryUsed)}</p>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50 hover:border-gray-700 transition-colors">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-base">⏳</span>
            <span className="text-xs text-gray-400">Avg Queue Wait</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatWaitTime(analytics.avgQueueWaitTime)}</p>
        </div>
      </div>
    </section>
  );
}