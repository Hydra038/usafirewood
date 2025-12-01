'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface AuthButtonProps {
  onAction?: () => void; // Optional callback when user performs an action
}

export default function AuthButton({ onAction }: AuthButtonProps = {}) {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      // Fetch user role if user exists
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        setUserRole(profile?.role || null);
      }

      setLoading(false);
    }

    checkUser();

    // Listen for auth changes
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      
      // Fetch role when auth state changes
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        setUserRole(profile?.role || null);
      } else {
        setUserRole(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    onAction?.(); // Call the callback if provided
    router.push('/');
    router.refresh();
  };

  const handleDashboardClick = () => {
    onAction?.(); // Call the callback if provided
  };

  if (loading) {
    return (
      <div className="bg-gray-300 text-gray-300 px-4 py-2 rounded cursor-wait">
        Loading...
      </div>
    );
  }

  if (user) {
    const dashboardUrl = userRole === 'admin' ? '/admin' : '/dashboard';
    
    return (
      <div className="flex items-center gap-2">
        <Link
          href={dashboardUrl}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded transition"
          onClick={handleDashboardClick}
        >
          Dashboard
        </Link>
        <button
          onClick={handleSignOut}
          className="text-gray-700 hover:text-primary-600 transition px-2"
          title="Sign Out"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/auth/login"
      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded transition flex items-center gap-2"
      onClick={onAction}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
        />
      </svg>
      Sign In
    </Link>
  );
}
