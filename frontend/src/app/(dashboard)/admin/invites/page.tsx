'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invitesApi } from '@/lib/api';
import { getStoredUser } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import {
  UserPlus, Copy, Check, Trash2, Link as LinkIcon, Users, Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? '';

function InviteRow({ invite, onRevoke }: { invite: any; onRevoke: () => void }) {
  const [copied, setCopied] = useState(false);
  const link = `${typeof window !== 'undefined' ? window.location.origin : BASE_URL}/register?invite=${invite.token}`;

  function copy() {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isUsed = !!invite.usedById;
  const isExpired = invite.expiresAt && new Date(invite.expiresAt) < new Date();
  const status = isUsed ? 'used' : isExpired ? 'expired' : 'active';

  return (
    <div className={cn('card p-4 space-y-2', (isUsed || isExpired) && 'opacity-60')}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          {invite.email && (
            <p className="text-sm font-medium text-stone-800 dark:text-stone-200 truncate">{invite.email}</p>
          )}
          {invite.note && (
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{invite.note}</p>
          )}
          {!invite.email && !invite.note && (
            <p className="text-xs text-stone-400 italic">No label</p>
          )}
        </div>
        <span className={cn(
          'shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full',
          status === 'active'  && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
          status === 'used'    && 'bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400',
          status === 'expired' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        )}>
          {status}
        </span>
      </div>

      {status === 'used' && invite.usedBy && (
        <p className="text-xs text-stone-400 flex items-center gap-1">
          <Users className="w-3 h-3" /> Joined as <span className="font-medium text-stone-600 dark:text-stone-300">{invite.usedBy.name}</span>
        </p>
      )}

      <div className="flex items-center gap-2 pt-1">
        <p className="text-xs text-stone-400 flex items-center gap-1 flex-1">
          <Clock className="w-3 h-3" /> Created {formatDate(invite.createdAt)}
        </p>
        {status === 'active' && (
          <button
            onClick={copy}
            className={cn(
              'flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all',
              copied
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700',
            )}
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        )}
        {!isUsed && (
          <button
            onClick={onRevoke}
            className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Revoke invite"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function AdminInvitesPage() {
  const user = getStoredUser();
  const qc = useQueryClient();
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { data: invites = [], isLoading } = useQuery({
    queryKey: ['invites'],
    queryFn: invitesApi.list,
  });

  const create = useMutation({
    mutationFn: () => invitesApi.create({ email: email.trim() || undefined, note: note.trim() || undefined }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invites'] });
      setEmail('');
      setNote('');
      setShowForm(false);
    },
  });

  const revoke = useMutation({
    mutationFn: (id: string) => invitesApi.revoke(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invites'] }),
  });

  const active = (invites as any[]).filter((i) => !i.usedById && (!i.expiresAt || new Date(i.expiresAt) >= new Date()));
  const used   = (invites as any[]).filter((i) => !!i.usedById);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-900 dark:text-stone-50">Invite links</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            {active.length} active · {used.length} used
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          New invite
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="card p-4 space-y-3 border-summit-200 dark:border-summit-800 bg-summit-50/50 dark:bg-summit-900/10">
          <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-200">Create invite link</h3>
          <div>
            <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">Email (optional — pre-fills their registration form)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input text-sm"
              placeholder="friend@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">Note (optional — shown on their registration page)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="input text-sm"
              placeholder="e.g. Welcome to the beta!"
              maxLength={200}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => create.mutate()}
              disabled={create.isPending}
              className="btn-primary text-sm flex items-center gap-1.5"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              {create.isPending ? 'Creating…' : 'Create link'}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="card p-4 animate-pulse space-y-2">
              <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-1/2" />
              <div className="h-3 bg-stone-100 dark:bg-stone-800 rounded w-1/3" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && (invites as any[]).length === 0 && (
        <div className="py-16 text-center text-stone-400 dark:text-stone-500">
          <UserPlus className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium">No invites yet</p>
          <p className="text-xs mt-1">Create a link to share with climbers you want to invite.</p>
        </div>
      )}

      <div className="space-y-3">
        {(invites as any[]).map((invite) => (
          <InviteRow
            key={invite.id}
            invite={invite}
            onRevoke={() => revoke.mutate(invite.id)}
          />
        ))}
      </div>
    </div>
  );
}
