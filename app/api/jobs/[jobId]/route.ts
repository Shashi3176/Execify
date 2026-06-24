import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '../../../../lib/db';
import { JobModel } from '../../../../models/Job';
import mongoose from 'mongoose';
import type { JobDocument } from '../../../../models/Job';

export async function GET(request: NextRequest, { params }: { params: { jobId: string } }): Promise<NextResponse> {
  try {
    await connectDB();
    const job = await JobModel.findById(params.jobId).lean();

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, job: job as JobDocument });
  } catch (error: unknown) {
    if (error instanceof mongoose.Error.CastError) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}