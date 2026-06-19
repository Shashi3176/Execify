import { NextResponse } from 'next/server';

// Will update worker pool concurrency
export async function POST() {
  return NextResponse.json({ success: true, message: 'Concurrency update endpoint ready' });
}