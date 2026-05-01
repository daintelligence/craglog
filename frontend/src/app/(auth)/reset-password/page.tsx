'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mountain, CheckCircle2, ArrowLeft } from 'lucide-react';
import { authApi, getErrorMessage } from '@/lib/api';

export default function ResetPasswordPage() {
  const router       = useRouter();
  const params       = useSearchParams();
  const token        = params.get('token') ?? '';

  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [done, setDone]           = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  useEffect(() => {
    if (!token) setError('Missing reset token. Please use the link from your email.');
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 8)  { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    setError('');
    try {
      await authApi.resetPassword(token, password);
      setDone(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rock-600 rounded-2xl mb-4 shadow-lg">
            <Mountain className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-stone-900">CragLog</h1>
        </div>

        <div className="card p-6">
          {done ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold text-stone-900">Password updated!</h2>
              <p className="text-sm text-stone-500">Redirecting you to sign in…</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-stone-900 mb-2">Set new password</h2>
              <p className="text-sm text-stone-500 mb-6">Choose a strong password — at least 8 characters.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">New password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Confirm password</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="input"
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                  />
                </div>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                    {error}
                  </div>
                )}
                <button type="submit" disabled={loading || !token} className="btn-primary w-full mt-2">
                  {loading ? 'Updating…' : 'Update password'}
                </button>
              </form>
              <div className="mt-4 text-center">
                <Link href="/login" className="text-sm text-stone-500 hover:text-rock-600 flex items-center justify-center gap-1.5">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
