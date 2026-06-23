import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { JobModel } from '@/models/Job';

export async function GET(request: Request) {
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
      .limit(limit);

    return NextResponse.json({
      jobs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}