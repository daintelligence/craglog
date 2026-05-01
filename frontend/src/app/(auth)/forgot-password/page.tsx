'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Mountain, ArrowLeft, Mail } from 'lucide-react';
import { authApi, getErrorMessage } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('');
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authApi.forgotPassword(email);
      setSent(true);
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
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto">
                <Mail className="w-7 h-7 text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold text-stone-900">Check your email</h2>
              <p className="text-sm text-stone-500 leading-relaxed">
                If an account exists for <span className="font-medium text-stone-700">{email}</span>,
                we've sent a reset link. It expires in 1 hour.
              </p>
              <Link href="/login" className="btn-secondary w-full mt-2 flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-stone-900 mb-2">Forgot password?</h2>
              <p className="text-sm text-stone-500 mb-6">
                Enter your email and we'll send you a reset link.
              </p>
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
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                    {error}
                  </div>
                )}
                <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
                  {loading ? 'Sending…' : 'Send reset link'}
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
