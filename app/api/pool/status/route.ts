import { NextResponse } from 'next/server';
import workerPool from '@/lib/workerPool';

export async function GET(): Promise<NextResponse> {
  try {
      const status = workerPool.getStatus();

      return NextResponse.json({
        success: true,
        PoolStatus: status
      })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
        success: false,
        error: message 
      },
      { status: 500 }
    )
  }
}