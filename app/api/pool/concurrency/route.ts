import { NextResponse } from 'next/server';
import workerPool from '../../../../lib/workerPool';
import { SettingsModel } from '../../../../models/Settings';
import { connectDB } from '../../../../lib/db';

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

      await connectDB();
      await workerPool.updateConcurrency(maxConcurrent)

      await SettingsModel.findOneAndUpdate(
        { _id: 'global' },
        { maxConcurrent },
        { upsert: true, new: true }
      );
    
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