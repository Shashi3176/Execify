import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { JobModel } from '@/models/Job';

interface SubmitBody {
  code: string;
  language: 'javascript' | 'python';
  priority: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, language, priority }: SubmitBody = body;

    if (!code || typeof code !== 'string' || !code.trim()) {
      return NextResponse.json(
        { success: false, error: 'Code is required and cannot be empty' },
        { status: 400 }
      );
    }

    await connectDB();

    const job = new JobModel({
      code,
      language,
      priority,
      status: 'queued',
      schedulingMode: 'fifo',
      queuedAt: new Date(),
    });

    await job.save();

    return NextResponse.json({ success: true, jobId: job._id.toString() });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}