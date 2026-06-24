'use client';

import { formatRelativeTime, getStatusConfig, shortenId } from '../../lib/dashboardUtils';

interface Job {
  _id: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  queuedAt?: string | Date;
  executionTime?: number;
  language?: string;
}

interface ActivityFeedProps {
  jobs: Job[];
  isLoading: boolean;
}

function SkeletonItem() {
  return (
    <div className="flex items-center gap-4 rounded-lg px-3 py-3">
      <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-gray-700" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-700" />
        <div className="h-3 w-32 animate-pulse rounded bg-gray-800" />
      </div>
      <div className="h-6 w-16 animate-pulse rounded-full bg-gray-700" />
    </div>
  );
}

export default function ActivityFeed({ jobs, isLoading }: ActivityFeedProps) {
  const recentJobs = jobs.slice(0, 10);

  return (
    <div className="bg-gray-900 border border-gray-700/50 rounded-xl p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        <p className="text-sm text-gray-400">Last 10 submissions</p>
      </div>

      {isLoading ? (
        <div className="space-y-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonItem key={i} />
          ))}
        </div>
      ) : recentJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <span className="text-3xl mb-2">📭</span>
          <p className="text-sm">No activity yet</p>
        </div>
      ) : (
        <div className="space-y-1">
          {recentJobs.map((job) => {
            const status = getStatusConfig(job.status);
            const relativeTime = formatRelativeTime(job.queuedAt);

            return (
              <div
                key={job._id}
                className="group flex items-center gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-gray-800/50"
              >
                <span className="shrink-0">
                  <span className="block h-2.5 w-2.5 rounded-full border-2 border-gray-600 bg-gray-900 group-hover:border-gray-500" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-mono text-sm text-gray-200">
                      {shortenId(job._id)}
                    </span>
                    {job.language && (
                      <span className="shrink-0 rounded bg-gray-800 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-gray-400">
                        {job.language}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">{relativeTime}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.bgColor} ${status.color}`}
                >
                  {status.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
