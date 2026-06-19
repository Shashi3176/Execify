'use client';

type Status = 'queued' | 'running' | 'completed' | 'failed';

interface StatusBadgeProps {
  status: Status;
}

const statusColors: Record<Status, string> = {
  queued: 'bg-blue-500 text-white',
  running: 'bg-yellow-500 text-white animate-pulse',
  completed: 'bg-green-500 text-white',
  failed: 'bg-red-500 text-white',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}
    >
      {status}
    </span>
  );
}