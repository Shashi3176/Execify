import { NextResponse } from 'next/server';
import workerPool from '@/lib/workerPool';

export async function POST(request: Request) {
  try {
    const {mode} = await request.json();

    if (mode !== 'fifo' && mode !== 'priority') {
      return NextResponse.json(
        { success: false, error: 'Mode must be "fifo" or "priority"' },
        { status: 400 }
      )
    }
    
    workerPool.setMode(mode)
    
    return NextResponse.json({
      success: true,
      message: `Scheduling mode set to ${mode}`
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}