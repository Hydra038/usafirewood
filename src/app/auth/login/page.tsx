'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error
    setError('');
    
    // Validate inputs before starting
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Start loading
    setLoading(true);
    console.log('🔵 Login attempt started for:', email);

    try {
      const supabase = createClient();
      console.log('🔵 Supabase client created');
      
      console.log('🔵 Attempting signInWithPassword...');
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      console.log('🔵 Sign in response:', { data, signInError });

      // Handle sign-in errors with user-friendly messages
      if (signInError) {
        console.error('🔴 Sign in error:', signInError);
        
        // Parse specific error messages
        const errorMessage = signInError.message.toLowerCase();
        if (errorMessage.includes('invalid login credentials') || errorMessage.includes('invalid')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else if (errorMessage.includes('email not confirmed')) {
          setError('Please verify your email address. Check your inbox for the verification link.');
        } else if (errorMessage.includes('user not found')) {
          setError('No account found with this email. Please sign up first.');
        } else {
          setError(signInError.message);
        }
        
        setLoading(false);
        return;
      }

      // Verify user exists in response
      if (!data || !data.user) {
        console.error('🔴 No user in response');
        setError('Sign in failed - no user data returned. Please try again.');
        setLoading(false);
        return;
      }

      console.log('🟢 User signed in:', data.user.email);
      console.log('🔵 Fetching user profile...');
      
      // Fetch user role - don't fail if profile doesn't exist
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.warn('⚠️ Profile fetch warning:', profileError);
      }

      console.log('🔵 Profile data:', { profile, profileError });

      // Only allow admin users to login
      const userRole = profile?.role || 'customer';
      if (userRole !== 'admin') {
        console.error('🔴 Non-admin user attempted login');
        await supabase.auth.signOut();
        setError('Access denied. This login is for administrators only.');
        setLoading(false);
        return;
      }

      console.log('🟢 Admin verified, redirecting to admin dashboard');
      
      // Redirect to admin dashboard
      router.push('/admin');
      router.refresh();

    } catch (err: any) {
      console.error('🔴 Login exception:', err);
      
      // Handle network and other errors
      if (err.message?.includes('fetch')) {
        setError('Network error. Please check your internet connection and try again.');
      } else if (err.message?.includes('timeout')) {
        setError('Request timed out. Please try again.');
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
      
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">Admin Sign In</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access restricted to administrators only
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
