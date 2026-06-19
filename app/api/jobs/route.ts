import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { JobModel } from '@/models/Job';

export async function GET() {
  try {
    await connectDB();
    const jobs = await JobModel.find({}).sort({ createdAt: -1 }).limit(50);
    return NextResponse.json({ success: true, jobs });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch jobs' }, { status: 500 });
  }
}