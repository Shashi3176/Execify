"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import SchedulingComparison from "@/components/SchedulingComparison";

interface ComparisonStats {
  totalJobs: number;
  avgWaitTime: number;
  avgTurnaroundTime: number;
  avgExecutionTime: number;
}

function timeAgo(iso: string | undefined) {
  if (!iso) return "just now";
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 5) return "just now";
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export default function DashboardPage() {
  const [poolStatus, setPoolStatus] = useState<{
    maxConcurrent: number;
    currentlyRunning: number;
    queueLength: number;
    activeJobIds: string[];
  } | null>(null);
  const [queueMode, setQueueMode] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [comparisonData, setComparisonData] = useState<{
    fifo: ComparisonStats;
    priority: ComparisonStats;
  } | null>(null);

  const [isLoadingPool, setIsLoadingPool] = useState(false);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isLoadingComparison, setIsLoadingComparison] = useState(true);
  const [poolError, setPoolError] = useState<string | null>(null);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [jobsError, setJobsError] = useState<string | null>(null);

  const [lastRefresh, setLastRefresh] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshAllRef = useRef<(() => void) | null>(null);
  const refreshAllRef2 = useRef<(() => void) | null>(null);

  const fetchPoolStatus = useCallback(async () => {
    try {
      setPoolError(null);
      const res = await fetch("/api/pool/status");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPoolStatus(data);
    } catch (err: any) {
      setPoolError(err.message ?? "Failed to load pool status");
    }
  }, []);

  const fetchQueueMode = useCallback(async () => {
    try {
      const res = await fetch("/api/pool/mode");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setQueueMode(data.mode ?? data.queueMode ?? null);
    } catch {
      setQueueMode(null);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      setAnalyticsError(null);
      const res = await fetch("/api/analytics");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setAnalytics(data);
    } catch (err: any) {
      setAnalyticsError(err.message ?? "Failed to load analytics");
    }
  }, []);

  const fetchJobs = useCallback(async () => {
    try {
      setJobsError(null);
      const res = await fetch("/api/jobs");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      let jobs: any[] = Array.isArray(data) ? data : data?.jobs ?? [];
      jobs.sort(
        (a, b) =>
          new Date(b.queuedAt ?? b.createdAt ?? 0).getTime() -
          new Date(a.queuedAt ?? a.createdAt ?? 0).getTime()
      );
      setRecentJobs(jobs.slice(0, 10));
    } catch (err: any) {
      setJobsError(err.message ?? "Failed to load jobs");
    }
  }, []);

  const fetchComparison = useCallback(async () => {
    try {
      const res = await fetch("/api/analytics/comparison");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setComparisonData(data);
    } catch {
      // Silently ignore — component handles null data gracefully
    } finally {
      setIsLoadingComparison(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([fetchPoolStatus(), fetchAnalytics(), fetchJobs(), fetchComparison()]);
    setLastRefresh(new Date().toISOString());
    setIsRefreshing(false);
  }, [fetchPoolStatus, fetchAnalytics, fetchJobs, fetchComparison]);

  refreshAllRef.current = refreshAll;
  refreshAllRef2.current = refreshAll;

  const handleConcurrencyApply = useCallback(
    async (maxConcurrent: number) => {
      await fetch("/api/pool/concurrency", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxConcurrent }),
      });
      await fetchPoolStatus();
    },
    [fetchPoolStatus]
  );

  const handleModeChange = useCallback(
    async (mode: string) => {
      await fetch("/api/pool/mode", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });
      await fetchQueueMode();
    },
    [fetchQueueMode]
  );

  useEffect(() => {
    refreshAllRef.current();
    const full = setInterval(
      () => refreshAllRef.current?.(),
      5_000
    );
    const pool = setInterval(fetchPoolStatus, 3_000);
    return () => {
      clearInterval(full);
      clearInterval(pool);
    };
  }, [fetchPoolStatus, fetchQueueMode]);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              ProcQueue Monitoring Center
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-mono">
              Updated {timeAgo(lastRefresh)}
            </span>
            <button
              onClick={() => refreshAllRef2.current?.()}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-[#0d1321] px-3.5 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition disabled:opacity-50"
            >
              <svg
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {(poolError || analyticsError || jobsError) && (
          <div className="mb-6 rounded-lg border border-red-900/50 bg-red-950/40 p-4 text-sm text-red-300">
            {(poolError || analyticsError || jobsError)
              ?.split("\n")
              .filter(Boolean)
              .map((line, i) => (
                <div key={i}>{line}</div>
              ))}
          </div>
        )}

        <div className="grid gap-6">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <PoolStatusCard
                status={poolStatus}
                isLoading={isLoadingPool}
              />
            </div>
            <div className="lg:col-span-7">
              <ControlPanel
                maxConcurrent={poolStatus?.maxConcurrent ?? 1}
                currentlyRunning={poolStatus?.currentlyRunning ?? 0}
                queueMode={queueMode}
                onConcurrencyApply={handleConcurrencyApply}
                onModeChange={handleModeChange}
                isLoading={isLoadingPool}
              />
            </div>
          </div>

          <AnalyticsCards analytics={analytics} isLoading={isLoadingAnalytics} />

          <SchedulingComparison
            data={comparisonData}
            isLoading={isLoadingComparison}
          />

          <ActivityFeed
            jobs={recentJobs}
            isLoading={isLoadingJobs}
          />
        </div>
      </div>
    </div>
  );
}
