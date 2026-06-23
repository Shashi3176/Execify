import workerPool from "@/lib/workerPool"

type QueueMode = 'fifo' | 'priority'

// Mode should ideally live in the worker pool singleton, which has setMode but not getQueueMode
let currentMode: QueueMode = 'fifo'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        return Response.json({ mode: currentMode })
    } catch {
        return Response.json({ error: 'Failed to get mode' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
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
    } catch {
        return Response.json({ error: 'Failed to update mode' }, { status: 500 })
    }
}