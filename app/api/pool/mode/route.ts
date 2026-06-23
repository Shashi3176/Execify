import workerPool from "@/lib/workerPool"

type QueueMode = 'fifo' | 'priority'

// Mode should ideally live in the worker pool singleton, which has setMode but not getQueueMode
let currentMode: QueueMode = 'fifo'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<Response> {
    try {
        return Response.json({ mode: currentMode })
    } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to get mode';
    return Response.json({ error: message }, { status: 500 })
    }
}

export async function PUT(request: Request): Promise<Response> {
    try {
        const body: { mode: string } = await request.json()
        const mode = body.mode

        if (mode !== 'fifo' && mode !== 'priority') {
            return Response.json(
                { error: "Mode must be 'fifo' or 'priority'" },
                { status: 400 }
            )
        }

        currentMode = mode
        workerPool.setMode(mode)
        return Response.json({ success: true, mode })
    } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update mode';
    return Response.json({ error: message }, { status: 500 })
    }
}