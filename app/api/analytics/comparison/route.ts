import { NextRequest, NextResponse } from 'next/server';
import { JobModel } from '@/models/Job';
import { connectDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface ComparisonStats {
  totalJobs: number;
  avgWaitTime: number;
  avgTurnaroundTime: number;
  avgExecutionTime: number;
}

interface ComparisonResponse {
  fifo: ComparisonStats;
  priority: ComparisonStats;
}

const zeroStats: ComparisonStats = {
  totalJobs: 0,
  avgWaitTime: 0,
  avgTurnaroundTime: 0,
  avgExecutionTime: 0,
};

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const result = await JobModel.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$queueMode',
          totalJobs: { $sum: 1 },
          avgWaitTime: {
            $avg: { $subtract: ['$startedAt', '$queuedAt'] },
          },
          avgTurnaroundTime: {
            $avg: { $subtract: ['$completedAt', '$queuedAt'] },
          },
          avgExecutionTime: { $avg: '$executionTime' },
        },
      },
    ]);

    const response: ComparisonResponse = {
      fifo: { ...zeroStats },
      priority: { ...zeroStats },
    };

    for (const doc of result) {
      const mode = doc._id as 'fifo' | 'priority';
      if (mode in response) {
        response[mode] = {
          totalJobs: doc.totalJobs,
          avgWaitTime:
            doc.avgWaitTime != null
              ? Math.round(doc.avgWaitTime * 100) / 100
              : 0,
          avgTurnaroundTime:
            doc.avgTurnaroundTime != null
              ? Math.round(doc.avgTurnaroundTime * 100) / 100
              : 0,
          avgExecutionTime:
            doc.avgExecutionTime != null
              ? Math.round(doc.avgExecutionTime * 100) / 100
              : 0,
        };
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        fifo: { ...zeroStats },
        priority: { ...zeroStats },
      },
      { status: 500 },
    );
  }
}
