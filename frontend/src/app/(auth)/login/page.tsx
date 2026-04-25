'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Mountain } from 'lucide-react';

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rock-600 rounded-2xl mb-4 shadow-lg">
            <Mountain className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-stone-900">CragLog</h1>
          <p className="text-stone-500 mt-1 text-sm">Your climbing logbook</p>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-semibold text-stone-900 mb-6">Sign in</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-stone-100 text-center">
            <p className="text-sm text-stone-500">
              No account?{' '}
              <Link href="/register" className="text-rock-600 font-medium hover:underline">
                Create one
              </Link>
            </p>
          </div>

          <div className="mt-3 p-3 bg-stone-50 rounded-xl">
            <p className="text-xs text-stone-400 text-center">
              Demo: <span className="font-mono">demo@craglog.app</span> / <span className="font-mono">demo1234</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
