export function formatRelativeTime(date: Date | string | null | undefined): string {
  if (!date) return "—";

  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diff < 10) return "just now";
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

export function formatExecutionTime(ms: number | null | undefined): string {
  if (ms == null || ms === 0) return "—";
  if (ms < 1) return "< 1ms";
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function formatMemory(bytes: number | null | undefined): string {
  if (bytes == null || bytes === 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(2)} MB`;
}

export function formatWaitTime(ms: number | null | undefined): string {
  if (ms == null || ms === 0) return "—";
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)} min`;
}

export function formatSuccessRate(rate: number | null | undefined): { text: string; colorClass: string } {
  const rateValue = rate ?? 0;
  const text = `${(rateValue).toFixed(1)}%`;

  let colorClass = "";
  if (rateValue >= 0.9) {
    colorClass = "text-green-400";
  } else if (rateValue >= 0.7) {
    colorClass = "text-yellow-400";
  } else {
    colorClass = "text-red-400";
  }

  return { text, colorClass };
}

export function getPoolStatusConfig(running: number, max: number): {
  isFull: boolean;
  availableSlots: number;
  utilizationPercent: number;
  barColor: string;
  statusColor: string;
  statusText: string;
} {
  const isFull = running >= max;
  const availableSlots = Math.max(max - running, 0);
  const utilizationPercent = max > 0 ? Math.round((running / max) * 100) : 0;

  let barColor = "";
  let statusColor = "";

  if (utilizationPercent === 0) {
    barColor = "bg-gray-600";
    statusColor = "text-gray-400";
  } else if (utilizationPercent <= 60) {
    barColor = "bg-green-500";
    statusColor = "text-green-400";
  } else if (utilizationPercent <= 85) {
    barColor = "bg-yellow-500";
    statusColor = "text-yellow-400";
  } else if (utilizationPercent < 100) {
    barColor = "bg-orange-500";
    statusColor = "text-orange-400";
  } else {
    barColor = "bg-red-500";
    statusColor = "text-red-400";
  }

  const statusText = `${running}/${max}`;

  return {
    isFull,
    availableSlots,
    utilizationPercent,
    barColor,
    statusColor,
    statusText,
  };
}

export function getStatusConfig(status: 'queued' | 'running' | 'completed' | 'failed' | string): {
  label: string;
  color: string;
  bgColor: string;
  dotColor: string;
} {
  const configs: Record<string, { label: string; color: string; bgColor: string; dotColor: string }> = {
    queued: {
      label: "Queued",
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      dotColor: "bg-blue-400",
    },
    running: {
      label: "Running",
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      dotColor: "bg-yellow-400",
    },
    completed: {
      label: "Completed",
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      dotColor: "bg-green-400",
    },
    failed: {
      label: "Failed",
      color: "text-red-400",
      bgColor: "bg-red-400/10",
      dotColor: "bg-red-400",
    },
  };

  return configs[status] ?? {
    label: "Unknown",
    color: "text-gray-400",
    bgColor: "bg-gray-400/10",
    dotColor: "bg-gray-400",
  };
}

export function shortenId(id: string | null | undefined): string {
  if (!id) return "—";
  return `${id.slice(0, 8)}...`;
}