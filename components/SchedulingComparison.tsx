'use client';

interface ComparisonStats {
  totalJobs: number;
  avgWaitTime: number;
  avgTurnaroundTime: number;
  avgExecutionTime: number;
}

interface ComparisonData {
  fifo: ComparisonStats;
  priority: ComparisonStats;
}

interface SchedulingComparisonProps {
  data: ComparisonData | null;
  isLoading: boolean;
}

function formatMetricValue(ms: number): string {
  if (ms === 0) return "—";
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export default function SchedulingComparison({ data, isLoading }: SchedulingComparisonProps) {
  if (isLoading && !data) {
    return (
      <div className="bg-gray-900 border border-gray-700/50 rounded-xl p-6">
        <div className="h-7 w-72 bg-gray-700 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-5">
            <div className="h-6 w-40 bg-gray-700 rounded animate-pulse mb-4" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-5 w-full bg-gray-700 rounded animate-pulse mb-3" />
            ))}
          </div>
          <div className="bg-gray-800 rounded-xl p-5">
            <div className="h-6 w-40 bg-gray-700 rounded animate-pulse mb-4" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-5 w-full bg-gray-700 rounded animate-pulse mb-3" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const fifoActive = data.fifo.totalJobs > 0;
  const priorityActive = data.priority.totalJobs > 0;

  if (!fifoActive && !priorityActive) {
    return (
      <div className="bg-gray-900 border border-gray-700/50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Scheduling Mode Comparison</h2>
        <div className="text-center">
          <div className="text-5xl mb-4">📊</div>
          <p className="text-xl text-gray-400 mb-2">No comparison data yet</p>
          <p className="text-sm text-gray-600 max-w-md text-center">
            Submit jobs in both FIFO and Priority modes to see how scheduling affects performance
          </p>
        </div>
      </div>
    );
  }

  const fifoStats = fifoActive ? data.fifo : { totalJobs: 0, avgWaitTime: 0, avgTurnaroundTime: 0, avgExecutionTime: 0 };
  const priorityStats = priorityActive ? data.priority : { totalJobs: 0, avgWaitTime: 0, avgTurnaroundTime: 0, avgExecutionTime: 0 };

  const renderMetricRow = (
    label: string,
    explanation: string,
    value: number,
    otherValue: number,
    isActive: boolean,
    otherIsActive: boolean
  ) => {
    let valueColor = "text-white";
    let showBadge = false;

    if (isActive && otherIsActive) {
      if (value < otherValue) {
        valueColor = "text-green-400";
        showBadge = true;
      } else if (value > otherValue) {
        valueColor = "text-red-400";
      }
    }

    return (
      <div className="flex justify-between items-center py-2.5 border-b border-gray-700/50 last:border-0">
        <div>
          <span className="text-sm text-gray-400">{label}</span>
          <div className="text-xs text-gray-600">{explanation}</div>
        </div>
        <div className={`text-lg font-mono font-semibold ${isActive ? valueColor : "text-gray-600"}`}>
          <span className="flex items-center">
            {isActive ? formatMetricValue(value) : "—"}
            {showBadge && (
              <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/30 rounded-full px-1.5 py-0.5 ml-2">
                ✓ lower
              </span>
            )}
          </span>
        </div>
      </div>
    );
  };

  const renderColumn = (
    icon: string,
    title: string,
    subtitle: string,
    stats: ComparisonStats,
    isActive: boolean,
    otherStats: ComparisonStats,
    otherIsActive: boolean,
    badgeColor: string
  ) => (
    <div className="bg-gray-800 rounded-xl p-5 relative overflow-hidden">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xl font-bold">{title}</div>
      <div className="text-xs text-gray-500 mt-0.5">{subtitle}</div>
      <div className="mt-2">
        {stats.totalJobs > 0 ? (
          <span className={`text-xs ${badgeColor} rounded-full px-2 py-0.5 inline-block`}>
            {stats.totalJobs} jobs
          </span>
        ) : (
          <span className="text-xs bg-gray-700 text-gray-500 rounded-full px-2 py-0.5 inline-block">
            No data
          </span>
        )}
      </div>
      <div className="mt-5 space-y-4">
        {renderMetricRow(
          "Wait Time",
          "queue → start",
          stats.avgWaitTime,
          otherStats.avgWaitTime,
          isActive,
          otherIsActive
        )}
        {renderMetricRow(
          "Turnaround",
          "submit → complete",
          stats.avgTurnaroundTime,
          otherStats.avgTurnaroundTime,
          isActive,
          otherIsActive
        )}
        {renderMetricRow(
          "Exec Time",
          "actual runtime",
          stats.avgExecutionTime,
          otherStats.avgExecutionTime,
          isActive,
          otherIsActive
        )}
      </div>
    </div>
  );

  const showPartialNotice = fifoActive !== priorityActive;

  return (
    <div className="bg-gray-900 border border-gray-700/50 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-2">Scheduling Mode Comparison</h2>
      <p className="text-xs text-gray-500 mb-6">Compare how different scheduling strategies affect job performance</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderColumn("→", "FIFO", "First In, First Out", fifoStats, fifoActive, priorityStats, priorityActive, "bg-blue-500/10 text-blue-400 border border-blue-500/30")}
        {renderColumn("★", "Priority Scheduling", "Higher priority jobs first", priorityStats, priorityActive, fifoStats, fifoActive, "bg-purple-500/10 text-purple-400 border border-purple-500/30")}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-800">
        <h3 className="text-sm font-medium text-gray-400 mb-3">How These Metrics Work</h3>
        <div className="space-y-2">
          <div className="text-xs leading-relaxed">
            <span className="text-gray-400">Wait Time: </span>
            <span className="text-gray-500">Time a job spends waiting in queue before execution starts</span>
          </div>
          <div className="text-xs leading-relaxed">
            <span className="text-gray-400">Turnaround Time: </span>
            <span className="text-gray-500">Total time from submission to completion (wait + execution)</span>
          </div>
          <div className="text-xs leading-relaxed">
            <span className="text-gray-400">Execution Time: </span>
            <span className="text-gray-500">Actual time spent running the code</span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          Switch between FIFO and Priority modes above and submit jobs to compare how scheduling strategy affects performance
        </p>
      </div>

      {showPartialNotice && (
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-400 text-center">
            Switch to {fifoActive ? "Priority" : "FIFO"} mode and submit more jobs to enable comparison
          </p>
        </div>
      )}
    </div>
  );
}