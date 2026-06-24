import { NextResponse } from 'next/server';
import workerPool from '@/lib/workerPool';
import { SettingsModel } from '@/models/Settings';
import { connectDB } from '@/lib/db';

export async function GET(): Promise<NextResponse> {
  try {
      await connectDB();
      await workerPool.syncFromSettings();
      const settings = await SettingsModel.findById('global').lean();
      const status = workerPool.getStatus();

      return NextResponse.json({
        success: true,
        PoolStatus: {
          ...status,
          maxConcurrent: settings?.maxConcurrent ?? status.maxConcurrent,
          activeJobIds: status.activeJobs,
        }
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