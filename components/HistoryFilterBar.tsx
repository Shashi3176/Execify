'use client';

import { TotalCounts } from '@/types';

interface HistoryFilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  totalCounts: TotalCounts;
}

export default function HistoryFilterBar({ activeFilter, onFilterChange, totalCounts }: HistoryFilterBarProps) {
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'queued', label: 'Queued' },
    { id: 'running', label: 'Running' },
    { id: 'completed', label: 'Completed' },
    { id: 'failed', label: 'Failed' },
  ];

  const getActiveStyles = (filterId: string) => {
    if (activeFilter !== filterId) return '';
    switch (filterId) {
      case 'all':
        return 'bg-blue-600 text-white';
      case 'queued':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/50';
      case 'running':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border border-green-500/50';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border border-red-500/50';
      default:
        return '';
    }
  };

  const getInactiveStyles = (filterId: string) => {
    if (activeFilter === filterId) return '';
    switch (filterId) {
      case 'all':
        return 'text-gray-400 hover:text-white hover:bg-gray-800';
      default:
        return 'text-gray-400 hover:text-gray-200 hover:bg-gray-800';
    }
  };

  const getBadgeStyles = (filterId: string) => {
    if (activeFilter === filterId) {
      switch (filterId) {
        case 'all':
          return 'bg-blue-600 text-white';
        case 'queued':
          return 'bg-blue-500 text-blue-100';
        case 'running':
          return 'bg-yellow-500 text-yellow-100';
        case 'completed':
          return 'bg-green-500 text-green-100';
        case 'failed':
          return 'bg-red-500 text-red-100';
        default:
          return '';
      }
    }
    return 'bg-gray-700 text-gray-300';
  };

  return (
    <div className="flex justify-between items-center gap-2 flex-wrap">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-gray-500 text-sm">Filter:</span>
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${getActiveStyles(
              filter.id
            )} ${getInactiveStyles(filter.id)}`}
          >
            <span>{filter.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded text-xs ${getBadgeStyles(filter.id)}`}
            >
              {totalCounts[filter.id as keyof TotalCounts]}
            </span>
          </button>
        ))}
      </div>
      <span className="text-gray-500 text-sm">
        Showing {totalCounts[activeFilter as keyof TotalCounts]} submissions
      </span>
    </div>
  );
}