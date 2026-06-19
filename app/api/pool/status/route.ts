import { NextResponse } from 'next/server';

// Will connect to worker pool
export async function GET() {
  return NextResponse.json({
    success: true,
    poolStatus: { maxConcurrent: 0, currentlyRunning: 0, queueLength: 0, activeJobIds: [], mode: 'fifo' }
  });
}