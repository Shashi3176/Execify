import workerPool from "@/lib/workerPool"
import { SettingsModel } from '@/models/Settings';
import { connectDB } from '@/lib/db';

type QueueMode = 'fifo' | 'priority'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<Response> {
    try {
        await connectDB();
        const settings = await SettingsModel.findById('global').lean();
        const mode = (settings?.mode as QueueMode) ?? 'fifo';
        return Response.json({ mode })
    } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to get mode';
    return Response.json({ error: message }, { status: 500 })
    }
}

export async function PUT(request: Request): Promise<Response> {
    try {
        await connectDB();
        const body: { mode: string } = await request.json()
        const mode = body.mode

        if (mode !== 'fifo' && mode !== 'priority') {
            return Response.json(
                { error: "Mode must be 'fifo' or 'priority'" },
                { status: 400 }
            )
        }

        workerPool.setMode(mode)
        await SettingsModel.findOneAndUpdate(
          { _id: 'global' },
          { mode },
          { upsert: true, new: true }
        );
        return Response.json({ success: true, mode })
    } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update mode';
    return Response.json({ error: message }, { status: 500 })
    }
}