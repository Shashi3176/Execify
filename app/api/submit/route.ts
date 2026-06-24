import { NextResponse } from 'next/server'
import { connectDB } from '../../../lib/db'
import { JobModel } from '../../../models/Job'
import workerPool from '../../../lib/workerPool'

interface SubmitBody {
  code: string;
  language?: string;
  priority?: number;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    await connectDB()
    
    const body: SubmitBody = await request.json()
    const { code, language, priority } = body
    
    // Validate
    if (!code || !code.trim()) {
      return NextResponse.json(
        { success: false, error: 'Code is required' },
        { status: 400 }
      )
    }
    
    // Create job in database
    const job = await JobModel.create({
      code,
      language: language || 'javascript',
      priority: priority || 3,
      status: 'queued',
      schedulingMode: workerPool.getStatus().mode
    })
    
    // Submit to worker pool
    await workerPool.submit(job._id.toString())
    
    return NextResponse.json({
      success: true,
      jobId: job._id.toString()
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
