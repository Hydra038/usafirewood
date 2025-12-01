import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    // Check user role and redirect accordingly
    if (data?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      // Redirect admins to admin dashboard, regular users to home
      const redirectUrl = profile?.role === 'admin' ? '/admin' : '/';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  // Redirect to home page after successful authentication
  return NextResponse.redirect(new URL('/', request.url));
}
