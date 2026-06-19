import { NextResponse } from 'next/server';

// Will compare FIFO vs Priority mode analytics
export async function GET() {
  return NextResponse.json({ success: true, comparison: { fifo: {}, priority: {} } });
}