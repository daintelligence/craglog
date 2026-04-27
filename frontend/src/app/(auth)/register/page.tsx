'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { invitesApi } from '@/lib/api';
import { Mountain, UserPlus } from 'lucide-react';

function RegisterForm() {
  const { register, loading, error } = useAuth();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get('invite') ?? undefined;
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [inviteValid, setInviteValid] = useState<boolean | null>(null);
  const [inviteNote, setInviteNote] = useState<string | null>(null);

  useEffect(() => {
    if (!inviteToken) return;
    invitesApi.validate(inviteToken)
      .then((invite) => {
        setInviteValid(true);
        if (invite.note) setInviteNote(invite.note);
        if (invite.email) setForm((f) => ({ ...f, email: invite.email }));
      })
      .catch(() => setInviteValid(false));
  }, [inviteToken]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(form.name, form.email, form.password, inviteToken);
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rock-600 rounded-2xl mb-4 shadow-lg">
            <Mountain className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-stone-900">CragLog</h1>
          <p className="text-stone-500 mt-1 text-sm">Start tracking your climbs</p>
        </div>

        {/* Invite banner */}
        {inviteToken && inviteValid === true && (
          <div className="mb-4 flex items-start gap-3 bg-summit-50 border border-summit-200 rounded-2xl px-4 py-3">
            <UserPlus className="w-4 h-4 text-summit-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-summit-800">You've been invited!</p>
              {inviteNote && <p className="text-xs text-summit-600 mt-0.5">{inviteNote}</p>}
            </div>
          </div>
        )}
        {inviteToken && inviteValid === false && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-700">
            This invite link has expired or already been used.
          </div>
        )}

        <div className="card p-6">
          <h2 className="text-xl font-semibold text-stone-900 mb-6">Create account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Your name</label>
              <input
                type="text"
                value={form.name}
                onChange={update('name')}
                className="input"
                placeholder="Alex Honnold"
                required
                autoComplete="name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={update('email')}
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
                value={form.password}
                onChange={update('password')}
                className="input"
                placeholder="Min. 8 characters"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-stone-100 text-center">
            <p className="text-sm text-stone-500">
              Already have an account?{' '}
              <Link href="/login" className="text-rock-600 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
