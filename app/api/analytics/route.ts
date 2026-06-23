import { NextResponse } from 'next/server';
import { JobModel } from '@/models/Job';
import { connectDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();

    const result = await JobModel.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          completed: [
            { $match: { status: 'completed' } },
            { $count: 'count' },
          ],
          failed: [
            { $match: { status: 'failed' } },
            { $count: 'count' },
          ],
          avgExecutionTime: [
            { $match: { status: 'completed' } },
            { $group: { _id: null, avg: { $avg: '$executionTime' } } },
          ],
          avgMemoryUsed: [
            { $match: { status: 'completed' } },
            { $group: { _id: null, avg: { $avg: '$memoryUsed' } } },
          ],
          avgQueueWaitTime: [
            {
              $match: {
                status: 'completed',
                startedAt: { $exists: true, $ne: null },
                queuedAt: { $exists: true, $ne: null },
              },
            },
            {
              $project: {
                waitTime: { $subtract: ['$startedAt', '$queuedAt'] },
              },
            },
            { $group: { _id: null, avg: { $avg: '$waitTime' } } },
          ],
        },
      },
    ]);

    const data = result[0];
    const totalSubmissions = data.total[0]?.count ?? 0;
    const completed = data.completed[0]?.count ?? 0;
    const failed = data.failed[0]?.count ?? 0;

    const successRate =
      totalSubmissions > 0
        ? Number(((completed / totalSubmissions) * 100).toFixed(1))
        : 0;

    const avgExecutionTime =
      data.avgExecutionTime[0]?.avg != null
        ? Number(data.avgExecutionTime[0].avg.toFixed(2))
        : 0;

    const avgMemoryUsed =
      data.avgMemoryUsed[0]?.avg != null
        ? Number(data.avgMemoryUsed[0].avg.toFixed(2))
        : 0;

    const avgQueueWaitTime =
      data.avgQueueWaitTime[0]?.avg != null
        ? Number(data.avgQueueWaitTime[0].avg.toFixed(2))
        : 0;

    return NextResponse.json({
      totalSubmissions,
      completed,
      failed,
      successRate,
      avgExecutionTime,
      avgMemoryUsed,
      avgQueueWaitTime,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 },
    );
  }
}
