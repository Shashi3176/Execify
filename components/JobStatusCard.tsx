'use client';

import { Job } from '@/types';
import StatusBadge from './StatusBadge';
import { useState, useEffect } from 'react';

interface JobStatusCardProps {
  jobId: string;
}

export default function JobStatusCard({ jobId }: JobStatusCardProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/jobs/${jobId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch job');
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setJob(data.job);
        } else {
          throw new Error(data.error || 'Failed to fetch job');
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
    // TODO: Replace with SSE connection in Phase 5
  }, [jobId]);

  if (loading) {
    return <div className="text-gray-400">Loading job status...</div>;
  }

  if (error) {
    return <div className="text-red-400">Error: {error}</div>;
  }

  if (!job) {
    return <div className="text-gray-400">Job not found</div>;
  }

  const statusMessages: Record<Job['status'], string> = {
    queued: 'Your code has been queued',
    running: 'Executing...',
    completed: 'Job completed successfully',
    failed: 'Job execution failed',
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-white">Job Submitted Successfully</h3>
      <div className="space-y-2">
        <p className="text-gray-400">
          Job ID: <span className="text-blue-400 font-mono">{job._id}</span>
        </p>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Status:</span>
          <StatusBadge status={job.status} />
        </div>
        <p className="text-gray-300">{statusMessages[job.status]}</p>
      </div>
      {/* SSE real-time updates will be added here */}
      <div className="h-4"></div>
    </div>
  );
}