import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { JobModel } from '@/models/Job';
import type { JobDocument } from '@/models/Job';

export async function GET(request: Request): Promise<NextResponse> {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const query: Record<string, unknown> = {};
    if (status && status.trim() !== '') {
      query.status = status;
    }

    const total = await JobModel.countDocuments(query);
    const jobs = await JobModel.find(query)
      .sort({ queuedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const typedJobs = jobs as unknown as JobDocument[];

    return NextResponse.json({
      jobs: typedJobs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch jobs';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}