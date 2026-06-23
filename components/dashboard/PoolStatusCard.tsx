'use client';

import { getPoolStatusConfig, formatRelativeTime, shortenId } from '@/lib/dashboardUtils';

interface PoolStatus {
  maxConcurrent: number;
  currentlyRunning: number;
  queueLength: number;
  activeJobIds: string[];
}

interface PoolStatusCardProps {
  poolStatus: PoolStatus | null;
  isLoading: boolean;
  lastRefresh: Date | null;
}

export default function PoolStatusCard({
  poolStatus,
  isLoading,
  lastRefresh,
}: PoolStatusCardProps) {
  const isSkeleton = isLoading && poolStatus === null;

  const running = poolStatus?.currentlyRunning ?? 0;
  const max = poolStatus?.maxConcurrent ?? 0;
  const queueLength = poolStatus?.queueLength ?? 0;
  const activeJobIds = poolStatus?.activeJobIds ?? [];

  const config = getPoolStatusConfig(running, max);
  const availableSlots = config.availableSlots;

  return (
    <div className="bg-gray-900 border border-gray-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Worker Pool</h2>
          <p className="text-sm text-gray-400">Real-time execution status</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{config.statusText}</span>
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              running >= max ? 'bg-red-500' : 'bg-green-500'
            }`}
          />
        </div>
      </div>

      {isSkeleton ? (
        <div className="space-y-4">
          <div className="h-10 w-32 animate-pulse rounded bg-gray-700" />
          <div className="h-3 w-full animate-pulse rounded-full bg-gray-700" />
          <div className="h-6 w-24 animate-pulse rounded bg-gray-700" />
          <div className="grid grid-cols-3 gap-3">
            <div className="h-16 animate-pulse rounded-lg bg-gray-700" />
            <div className="h-16 animate-pulse rounded-lg bg-gray-700" />
            <div className="h-16 animate-pulse rounded-lg bg-gray-700" />
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <div className="text-3xl font-bold text-white">
              {running} / {max}
            </div>
            <p className="text-sm text-gray-400 mt-1">Active Workers</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">
                {config.utilizationPercent}%
              </span>
              <span className={`text-xs font-medium ${config.statusColor}`}>
                {config.statusText}
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-700">
              <div
                className={`h-full rounded-full ${config.barColor} transition-all duration-700 ease-in-out`}
                style={{ width: `${config.utilizationPercent}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-gray-700/50 bg-gray-800/50 p-3">
              <p className="text-xs text-gray-400">Jobs Waiting</p>
              <p className="text-lg font-semibold text-white">{queueLength}</p>
            </div>
            <div className="rounded-lg border border-gray-700/50 bg-gray-800/50 p-3">
              <p className="text-xs text-gray-400">Available Slots</p>
              <p className="text-lg font-semibold text-white">{availableSlots}</p>
            </div>
            <div className="rounded-lg border border-gray-700/50 bg-gray-800/50 p-3">
              <p className="text-xs text-gray-400">Running Now</p>
              <p className="text-lg font-semibold text-white">{activeJobIds.length}</p>
            </div>
          </div>

          {activeJobIds.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeJobIds.map((id) => (
                <span
                  key={id}
                  className="rounded-md border border-gray-600/50 bg-gray-800 px-2 py-1 font-mono text-xs text-gray-300"
                >
                  {shortenId(id)}
                </span>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-500">
            Last updated: {formatRelativeTime(lastRefresh)}
          </p>
        </div>
      )}
    </div>
  );
}
