'use client';

interface PrioritySelectorProps {
  value: number;
  onChange: (priority: number) => void;
}

const priorityLabels: Record<number, string> = {
  1: 'Low',
  2: '',
  3: 'Medium',
  4: '',
  5: 'High',
};

export default function PrioritySelector({ value, onChange }: PrioritySelectorProps) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((priority) => (
        <button
          key={priority}
          type="button"
          onClick={() => onChange(priority)}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            value === priority
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {priorityLabels[priority] || priority}
        </button>
      ))}
    </div>
  );
}