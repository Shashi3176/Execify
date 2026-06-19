import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { JobModel } from '@/models/Job';

export async function GET(request: Request, { params }: { params: { jobId: string } }) {
  // SSE implementation will be added later
  try {
    await connectDB();
    const job = await JobModel.findById(params.jobId);
    if (!job) {
      return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, job });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch job' }, { status: 500 });
  }
}