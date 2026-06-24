import { connectDB } from '../../../../lib/db';
import { JobModel } from '../../../../models/Job';
import type { JobDocument } from '../../../../models/Job';

interface StatusUpdate {
  status: string;
  output: string;
  error: string;
  pid?: number;
  executionTime?: number;
  memoryUsed?: number;
  queuePosition?: number;
  startedAt?: Date;
  completedAt?: Date;
  priority?: number;
  language?: string;
}

export async function GET(request: Request, { params }: { params: { jobId: string } }): Promise<Response> {
  await connectDB();
  const {jobId} = params;
  const job = await JobModel.findById(jobId);

  if(!job){
    return new Response('Job not found', {status: 404})
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: StatusUpdate) => {
        const message = `data: ${JSON.stringify(data)}\n\n`
        controller.enqueue(encoder.encode(message))
      }

      const intervalId = setInterval(async() => {
          try {
              await connectDB();
              const updatedJob = await JobModel.findById(jobId).lean() as unknown as JobDocument

              if(!updatedJob){
                clearInterval(intervalId)
                controller.close()
                return 
              }

              sendEvent({
                status: updatedJob.status,
                output: updatedJob.output || '',
                error: updatedJob.error || '',
                pid: updatedJob.pid,
                executionTime: updatedJob.executionTime,
                memoryUsed: updatedJob.memoryUsed,
                queuePosition: updatedJob.queuePosition,
                startedAt: updatedJob.startedAt,
                completedAt: updatedJob.completedAt,
                priority: updatedJob.priority,
                language: updatedJob.language
              })

              if(updatedJob.status === 'completed' || updatedJob.status === 'failed'){
                clearInterval(intervalId)
                controller.close()
              }
          } catch (error: unknown) {
              console.error('SSE polling error', error instanceof Error ? error.message : 'Unknown error')
              clearInterval(intervalId)
              controller.close()
          }          
      },1000)

      request.signal.addEventListener('abort', () => {
          clearInterval(intervalId) 
          controller.close()
      })

    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    }
  })
}