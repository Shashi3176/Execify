import { NextResponse } from 'next/server';
import workerPool from '@/lib/workerPool';

interface ConcurrencyBody {
  maxConcurrent: number;
}

export async function PUT(request: Request): Promise<NextResponse> {
  try {
      const body: ConcurrencyBody = await request.json();
      const { maxConcurrent } = body;

      if (!maxConcurrent || maxConcurrent < 1) {
        return NextResponse.json({
          success: false,
          error: 'Invalid concurrency value' 
        },
        { status: 400 }
        )}

        await workerPool.updateConcurrency(maxConcurrent)
    
        return NextResponse.json({
          success: true,
          message: `Concurrency updated to ${maxConcurrent}`
        })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}