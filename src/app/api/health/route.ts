import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  try {
    // Test database connection
    const { error } = await supabase.from('profiles').select('count').single();

    if (error) {
      return NextResponse.json(
        { status: 'error', message: 'Database connection failed', error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Health check failed' },
      { status: 500 }
    );
  }
}
