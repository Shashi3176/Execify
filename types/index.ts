export interface Job {
  _id: string;
  code: string;
  language: 'javascript' | 'python';
  status: 'queued' | 'running' | 'completed' | 'failed';
  output: string;
  error: string;
  pid?: number;
  executionTime?: number;
  memoryUsed?: number;
  queuedAt: string;
  startedAt?: string;
  completedAt?: string;
  priority: number;
  queuePosition?: number;
  schedulingMode: 'fifo' | 'priority';
}

export interface PoolStatus {
  maxConcurrent: number;
  currentlyRunning: number;
  queueLength: number;
  activeJobIds: string[];
  mode: 'fifo' | 'priority';
}

export interface Analytics {
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  successRate: number;
  avgExecutionTime: number;
  avgMemoryUsed: number;
  avgWaitTime: number;
}