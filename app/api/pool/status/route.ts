import { NextResponse } from 'next/server';
import workerPool from '@/lib/workerPool';

export async function GET() {
  try {
      const status = workerPool.getStatus();

      return NextResponse.json({
        success: true,
        PoolStatus: status
      })
  } catch (error: any) {
    return NextResponse.json({
        success: false,
        error: error.message 
      },
      { status: 500 }
    )
  }
}