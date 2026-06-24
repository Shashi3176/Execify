import { NextResponse } from 'next/server';
import { JobModel } from '../../../models/Job';
import { connectDB } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
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
          queued: [
            { $match: { status: 'queued' } },
            { $count: 'count' },
          ],
          running: [
            { $match: { status: 'running' } },
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
    const totalJobs = data.total[0]?.count ?? 0;
    const completedJobs = data.completed[0]?.count ?? 0;
    const failedJobs = data.failed[0]?.count ?? 0;
    const queuedJobs = data.queued[0]?.count ?? 0;
    const runningJobs = data.running[0]?.count ?? 0;

    const finishedJobs = completedJobs + failedJobs;
    const successRate =
      finishedJobs > 0
        ? Number(((completedJobs / finishedJobs) * 100).toFixed(2))
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
      success: true,
      analytics: {
        totalSubmissions: totalJobs,
        completed: completedJobs,
        failed: failedJobs,
        queued: queuedJobs,
        running: runningJobs,
        successRate,
        avgExecutionTime,
        avgMemoryUsed,
        avgQueueWaitTime,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
