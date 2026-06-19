import { NextResponse } from 'next/server';

export async function POST() {
  try {
    return NextResponse.json({ success: true, message: 'Job submission endpoint ready' });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}