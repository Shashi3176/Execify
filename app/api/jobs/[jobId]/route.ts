import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { JobModel } from '@/models/Job';
import mongoose from 'mongoose';

export async function GET(request: NextRequest, { params }: { params: { jobId: string } }) {
  try {
    await connectDB();
    const job = await JobModel.findById(params.jobId);

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, job });
  } catch (error) {
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