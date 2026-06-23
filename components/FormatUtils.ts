export type JobStatus = 'queued' | 'running' | 'completed' | 'failed';

export type Language = 'javascript' | 'python' | 'cpp' | 'java';

export interface LanguageConfig {
  label: string;
  icon: string;
  badgeClass: string;
  monacoId: string;
}

export const LANGUAGE_CONFIG: Record<Language, LanguageConfig> = {
  javascript: {
    label: "JavaScript",
    icon: "⚡",
    badgeClass: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    monacoId: "javascript"
  },
  python: {
    label: "Python",
    icon: "🐍",
    badgeClass: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    monacoId: "python"
  },
  cpp: {
    label: "C++",
    icon: "⚙️",
    badgeClass: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    monacoId: "cpp"
  },
  java: {
    label: "Java",
    icon: "☕",
    badgeClass: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    monacoId: "java"
  },
};

export function formatBytes(bytes: number | null | undefined): string {
  if (bytes == null || isNaN(bytes) || bytes === 0 || bytes < 0) {
    return "—";
  }
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1048576) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  if (bytes < 1073741824) {
    return `${(bytes / 1048576).toFixed(2)} MB`;
  }
  return `${(bytes / 1073741824).toFixed(2)} GB`;
}

export function formatDuration(ms: number | null | undefined): string {
  if (ms == null || isNaN(ms) || ms < 0) {
    return "—";
  }
  if (ms === 0 || ms < 1) {
    return "< 1ms";
  }
  if (ms < 1000) {
    return `${Math.round(ms)}ms`;
  }
  if (ms < 60000) {
    return `${(ms / 1000).toFixed(2)}s`;
  }
  return `${(ms / 60000).toFixed(1)} min`;
}

export function formatTimeAgo(date: string | Date | null | undefined): string {
  if (date == null) {
    return "—";
  }
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return "—";
  }
  const diffSeconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diffSeconds < 0) {
    return "just now";
  }
  if (diffSeconds < 10) {
    return "just now";
  }
  if (diffSeconds < 60) {
    return `${diffSeconds}s ago`;
  }
  if (diffSeconds < 3600) {
    return `${Math.floor(diffSeconds / 60)} min ago`;
  }
  if (diffSeconds < 86400) {
    return `${Math.floor(diffSeconds / 3600)} hr ago`;
  }
  if (diffSeconds < 604800) {
    return `${Math.floor(diffSeconds / 86400)} days ago`;
  }
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatJobId(id: string | null | undefined): string {
  if (id == null || id === '') {
    return "—";
  }
  if (id.length <= 8) {
    return id;
  }
  return `${id.slice(0, 8)}...`;
}

export function formatSuccessRate(rate: number | null | undefined): string {
  if (rate == null || isNaN(rate)) {
    return "—";
  }
  return `${Math.min(100, Math.max(0, rate)).toFixed(1)}%`;
}

export function getStatusColor(status: string): { text: string; bg: string; dot: string; border: string } {
  const map: Record<string, { text: string; bg: string; dot: string; border: string }> = {
    queued: {
      text: "text-blue-400",
      bg: "bg-blue-400/10",
      dot: "bg-blue-400",
      border: "border-blue-400/30"
    },
    running: {
      text: "text-yellow-400",
      bg: "bg-yellow-400/10",
      dot: "bg-yellow-400",
      border: "border-yellow-400/30"
    },
    completed: {
      text: "text-green-400",
      bg: "bg-green-400/10",
      dot: "bg-green-400",
      border: "border-green-400/30"
    },
    failed: {
      text: "text-red-400",
      bg: "bg-red-400/10",
      dot: "bg-red-400",
      border: "border-red-400/30"
    }
  };
  return map[status] ?? {
    text: "text-gray-400",
    bg: "bg-gray-400/10",
    dot: "bg-gray-400",
    border: "border-gray-400/30"
  };
}

export function clsx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
