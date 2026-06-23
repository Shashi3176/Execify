import { NextResponse } from 'next/server';
import workerPool from '@/lib/workerPool';

export async function PUT(request: Request) {
  try {
      const {maxConcurrent} = await request.json();

      if(!maxConcurrent || maxConcurrent < 1){
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
  } catch (error: any) {
      return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}