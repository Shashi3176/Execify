import { Job } from '../types';

export function formatRelativeTime(dateString: string | Date | null | undefined): string {
  if (!dateString) return "—"

  const date = typeof dateString === "string" ? new Date(dateString) : dateString
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHrs = Math.floor(diffMin / 60)
  const diffDays = Math.floor(diffHrs / 24)

  if (diffSec < 60) return "just now"
  if (diffMin < 60) return `${diffMin} min ago`
  if (diffHrs < 24) return `${diffHrs} hrs ago`
  if (diffDays < 30) return `${diffDays} days ago`

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function formatExecutionTime(ms: number | null | undefined): string {
  if (ms == null) return "—"

  if (ms < 1) return "< 1ms"
  if (ms < 1000) return `${ms}ms`

  return `${(ms / 1000).toFixed(2)}s`
}

export function formatMemory(bytes: number | null | undefined): string {
  if (bytes == null) return "—"

  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function shortenId(id: string | null | undefined): string {
  if (!id) return "—"

  return `${id.slice(0, 8)}...`
}

export function getStatusConfig(status: Job['status']): { label: string; color: string; bgColor: string; dotColor: string } {
  const configs: Record<string, { label: string; color: string; bgColor: string; dotColor: string }> = {
    queued: { label: "Queued", color: "text-blue-400", bgColor: "bg-blue-400/10", dotColor: "bg-blue-400" },
    running: { label: "Running", color: "text-yellow-400", bgColor: "bg-yellow-400/10", dotColor: "bg-yellow-400" },
    completed: { label: "Completed", color: "text-green-400", bgColor: "bg-green-400/10", dotColor: "bg-green-400" },
    failed: { label: "Failed", color: "text-red-400", bgColor: "bg-red-400/10", dotColor: "bg-red-400" },
  }

  return configs[status] || { label: "Unknown", color: "text-gray-400", bgColor: "bg-gray-400/10", dotColor: "bg-gray-400" }
}

export function getLanguageConfig(language: Job['language']): { label: string; badgeColor: string; icon: string } {
  const configs: Record<string, { label: string; badgeColor: string; icon: string }> = {
    javascript: { label: "JavaScript", badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30", icon: "⚡" },
    python: { label: "Python", badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30", icon: "🐍" },
    cpp: { label: "C++", badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30", icon: "⚙️" },
    java: { label: "Java", badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/30", icon: "☕" },
  }

  return configs[language] || { label: language, badgeColor: "bg-gray-500/20 text-gray-300 border-gray-500/30", icon: "📄" }
}