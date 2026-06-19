import { NextResponse } from 'next/server';

// Will update scheduling mode
export async function POST() {
  return NextResponse.json({ success: true, message: 'Mode update endpoint ready' });
}