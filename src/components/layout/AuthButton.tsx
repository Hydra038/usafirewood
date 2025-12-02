'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface AuthButtonProps {
  onAction?: () => void;
}

export default function AuthButton({ onAction }: AuthButtonProps = {}) {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!mounted) return;

        setUser(user);

        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (mounted) {
            setIsAdmin(profile?.role === 'admin');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    // Timeout after 2 seconds
    const timeout = setTimeout(() => {
      if (mounted) {
        setLoading(false);
      }
    }, 2000);

    checkAuth();

    // Listen for auth changes
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        setUser(session?.user ?? null);

        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (mounted) {
            setIsAdmin(profile?.role === 'admin');
          }
        } else {
          setIsAdmin(false);
        }
      }
    );

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
      setIsAdmin(false);
      onAction?.(); // Call the callback if provided
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-200 px-4 py-2 rounded text-sm text-gray-500">
        ...
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/admin"
          onClick={onAction}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded text-sm font-medium"
        >
          Admin
        </Link>
        <button
          onClick={handleSignOut}
          className="text-gray-700 hover:text-red-600 p-2"
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

  // Admin-only system - no public sign in button
  return null;
}
