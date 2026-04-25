'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  User as UserIcon, Sun, Moon, ChevronRight, Download, LogOut,
  Award, Mountain, Calendar, TrendingUp, Edit2, Lock, Check,
  X, Eye, EyeOff, Star, Shield,
} from 'lucide-react';
import { authApi, usersApi, statsApi, badgesApi, exportApi, getErrorMessage } from '@/lib/api';
import { clearAuth, getStoredUser, saveAuth } from '@/lib/auth';
import { useDarkMode } from '@/hooks/useDarkMode';
import { cn } from '@/lib/utils';
import type { User, BadgeTier } from '@/types';
import { BADGE_TIER_COLORS } from '@/types';

// ─── helpers ──────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

function memberSince(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

const TIER_LABEL: Record<BadgeTier, string> = {
  bronze: 'Bronze', silver: 'Silver', gold: 'Gold', platinum: 'Platinum',
};

// ─── sub-components ───────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider px-1 mb-2">
      {children}
    </h2>
  );
}

function SettingRow({
  icon: Icon,
  label,
  sublabel,
  onClick,
  right,
  danger,
}: {
  icon: React.ElementType;
  label: string;
  sublabel?: string;
  onClick?: () => void;
  right?: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors',
        danger
          ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30'
          : 'hover:bg-stone-50 dark:hover:bg-stone-800/60',
      )}
    >
      <div className={cn(
        'w-8 h-8 rounded-xl flex items-center justify-center shrink-0',
        danger ? 'bg-red-100 dark:bg-red-950/50' : 'bg-stone-100 dark:bg-stone-800',
      )}>
        <Icon className={cn('w-4 h-4', danger ? 'text-red-500' : 'text-stone-600 dark:text-stone-300')} />
      </div>
      <div className="flex-1 min-w-0">
        <div className={cn('text-sm font-medium', danger ? 'text-red-500' : 'text-stone-900 dark:text-stone-50')}>
          {label}
        </div>
        {sublabel && (
          <div className="text-xs text-stone-400 dark:text-stone-500 truncate">{sublabel}</div>
        )}
      </div>
      {right ?? <ChevronRight className="w-4 h-4 text-stone-300 dark:text-stone-600 shrink-0" />}
    </button>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 overflow-hidden', className)}>
      {children}
    </div>
  );
}

// ─── edit profile modal ───────────────────────────────────────────────────────

function EditProfileSheet({
  user,
  onClose,
}: {
  user: User;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [error, setError] = useState('');

  const mut = useMutation({
    mutationFn: () => usersApi.updateProfile({ name: name.trim(), bio: bio.trim() }),
    onSuccess: (updated: User) => {
      const stored = getStoredUser();
      if (stored) saveAuth(localStorage.getItem('craglog_token')!, { ...stored, ...updated });
      qc.setQueryData(['me'], (old: User | undefined) => old ? { ...old, ...updated } : updated);
      onClose();
    },
    onError: (e) => setError(getErrorMessage(e)),
  });

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-stone-900 rounded-t-3xl p-6 space-y-4 max-w-2xl w-full mx-auto">
        <div className="w-10 h-1 bg-stone-200 dark:bg-stone-700 rounded-full mx-auto mb-2" />
        <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50">Edit Profile</h3>

        <div className="space-y-1">
          <label className="label">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full input"
            placeholder="Your name"
          />
        </div>

        <div className="space-y-1">
          <label className="label">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full input resize-none"
            placeholder="A few words about your climbing…"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 btn-secondary py-3">Cancel</button>
          <button
            onClick={() => mut.mutate()}
            disabled={mut.isPending || !name.trim()}
            className="flex-1 btn-primary py-3"
          >
            {mut.isPending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── change password modal ────────────────────────────────────────────────────

function ChangePasswordSheet({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const mut = useMutation({
    mutationFn: () => usersApi.changePassword({ currentPassword: current, newPassword: next }),
    onSuccess: () => setDone(true),
    onError: (e) => setError(getErrorMessage(e)),
  });

  const handleSubmit = () => {
    setError('');
    if (next.length < 8) { setError('New password must be at least 8 characters'); return; }
    if (next !== confirm) { setError('Passwords do not match'); return; }
    mut.mutate();
  };

  if (done) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col justify-end">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white dark:bg-stone-900 rounded-t-3xl p-6 text-center max-w-2xl w-full mx-auto">
          <div className="w-14 h-14 rounded-full bg-summit-100 dark:bg-summit-900/30 flex items-center justify-center mx-auto mb-4">
            <Check className="w-7 h-7 text-summit-600" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50 mb-1">Password changed</h3>
          <p className="text-sm text-stone-500 mb-6">Your password has been updated.</p>
          <button onClick={onClose} className="w-full btn-primary py-3">Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-stone-900 rounded-t-3xl p-6 space-y-4 max-w-2xl w-full mx-auto">
        <div className="w-10 h-1 bg-stone-200 dark:bg-stone-700 rounded-full mx-auto mb-2" />
        <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50">Change Password</h3>

        {(['Current password', 'New password', 'Confirm new password'] as const).map((lbl, i) => {
          const val = i === 0 ? current : i === 1 ? next : confirm;
          const set = i === 0 ? setCurrent : i === 1 ? setNext : setConfirm;
          const show = i === 0 ? showCurrent : showNext;
          const toggle = i === 0 ? () => setShowCurrent((p) => !p) : i === 1 ? () => setShowNext((p) => !p) : undefined;
          return (
            <div key={lbl} className="space-y-1">
              <label className="label">{lbl}</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={val}
                  onChange={(e) => set(e.target.value)}
                  className="w-full input pr-10"
                  placeholder="••••••••"
                />
                {toggle && (
                  <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 btn-secondary py-3">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={mut.isPending || !current || !next || !confirm}
            className="flex-1 btn-primary py-3"
          >
            {mut.isPending ? 'Updating…' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── export sheet ─────────────────────────────────────────────────────────────

function ExportSheet({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState<string | null>(null);

  const download = async (format: 'csv' | 'json') => {
    setLoading(format);
    try {
      await exportApi.download(format);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-stone-900 rounded-t-3xl p-6 space-y-4 max-w-2xl w-full mx-auto">
        <div className="w-10 h-1 bg-stone-200 dark:bg-stone-700 rounded-full mx-auto mb-2" />
        <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50">Export Your Data</h3>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Download all your ascents as a CSV or JSON file.
        </p>

        <div className="space-y-3">
          {(['csv', 'json'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => download(fmt)}
              disabled={!!loading}
              className="w-full flex items-center gap-3 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-rock-100 dark:bg-rock-900/30 flex items-center justify-center">
                <Download className="w-5 h-5 text-rock-600" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-stone-900 dark:text-stone-50">
                  {fmt === 'csv' ? 'CSV Spreadsheet' : 'JSON Data'}
                </div>
                <div className="text-xs text-stone-400">
                  {fmt === 'csv' ? 'Open in Excel, Google Sheets' : 'Full structured data'}
                </div>
              </div>
              {loading === fmt && (
                <div className="ml-auto w-4 h-4 border-2 border-rock-500 border-t-transparent rounded-full animate-spin" />
              )}
            </button>
          ))}
        </div>

        <button onClick={onClose} className="w-full btn-secondary py-3">Close</button>
      </div>
    </div>
  );
}

// ─── personal bests ───────────────────────────────────────────────────────────

function PersonalBests() {
  const { data: bests } = useQuery({
    queryKey: ['personal-bests'],
    queryFn: () => statsApi.personalBests(),
    staleTime: 10 * 60 * 1000,
  });

  if (!bests) return null;
  const { hardestOnsight, hardestFlash, hardestRedpoint, longestRoute, mostVisitedCrag } = bests;
  if (!hardestOnsight && !hardestRedpoint && !longestRoute) return null;

  const rows = [
    hardestOnsight   && { label: 'Hardest onsight',   grade: hardestOnsight.grade,   system: hardestOnsight.grade_system,   name: hardestOnsight.route_name,   sub: hardestOnsight.crag_name },
    hardestFlash     && { label: 'Hardest flash',     grade: hardestFlash.grade,     system: hardestFlash.grade_system,     name: hardestFlash.route_name,     sub: hardestFlash.crag_name },
    hardestRedpoint  && { label: 'Hardest redpoint',  grade: hardestRedpoint.grade,  system: hardestRedpoint.grade_system,  name: hardestRedpoint.route_name,  sub: hardestRedpoint.crag_name },
    longestRoute     && { label: 'Longest route',     grade: `${longestRoute.height}m`, system: null, name: longestRoute.route_name, sub: longestRoute.crag_name },
    mostVisitedCrag  && { label: 'Most visited crag', grade: `${mostVisitedCrag.visits}×`, system: null, name: mostVisitedCrag.name, sub: null },
  ].filter(Boolean) as { label: string; grade: string; system: string | null; name: string; sub: string | null }[];

  return (
    <div>
      <SectionTitle>Personal Bests</SectionTitle>
      <Card>
        {rows.map((row, i) => (
          <div key={row.label}>
            {i > 0 && <div className="divider mx-4" />}
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-8 h-8 rounded-xl bg-rock-100 dark:bg-rock-900/30 flex items-center justify-center shrink-0">
                <Star className="w-4 h-4 text-rock-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-stone-400 font-medium mb-0.5">{row.label}</div>
                <div className="text-sm font-semibold text-stone-900 dark:text-stone-50 truncate">{row.name}</div>
                {row.sub && <div className="text-xs text-stone-400 truncate">{row.sub}</div>}
              </div>
              <span className="text-sm font-bold text-rock-600 dark:text-rock-400 shrink-0">{row.grade}</span>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── badges section ───────────────────────────────────────────────────────────

function BadgesGrid() {
  const { data: badges } = useQuery({
    queryKey: ['my-badges'],
    queryFn: () => badgesApi.mine(),
  });

  if (!badges?.length) return null;

  return (
    <div>
      <SectionTitle>Badges Earned</SectionTitle>
      <div className="grid grid-cols-3 gap-3">
        {badges.map(({ badge, earnedAt }: { badge: any; earnedAt: string }) => (
          <div
            key={badge.id}
            className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-3 flex flex-col items-center gap-2 text-center"
          >
            <div className={cn('w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center text-2xl', BADGE_TIER_COLORS[badge.tier as BadgeTier])}>
              {badge.icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-900 dark:text-stone-50 leading-tight">{badge.name}</p>
              <p className="text-[10px] text-stone-400 mt-0.5">{TIER_LABEL[badge.tier as BadgeTier]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter();
  const { isDark, toggle } = useDarkMode();
  const [sheet, setSheet] = useState<'edit' | 'password' | 'export' | null>(null);

  const { data: user } = useQuery<User>({
    queryKey: ['me'],
    queryFn: () => authApi.me(),
    initialData: getStoredUser() ?? undefined,
    staleTime: 5 * 60 * 1000,
  });

  const { data: stats } = useQuery({
    queryKey: ['stats-dashboard'],
    queryFn: () => statsApi.dashboard(),
    staleTime: 5 * 60 * 1000,
  });

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const topGrade = (() => {
    if (!stats?.gradeDistribution?.length) return '—';
    const sorted = [...stats.gradeDistribution].sort((a: any, b: any) => b.difficulty - a.difficulty);
    return sorted[0]?.grade ?? '—';
  })();

  return (
    <div className="space-y-6 pb-4">

      {/* ── Avatar card ─────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-rock-600 to-rock-800 rounded-3xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
            <span className="text-xl font-bold text-white">
              {user?.name ? initials(user.name) : <UserIcon className="w-7 h-7" />}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold truncate">{user?.name ?? 'Climber'}</h1>
            {user?.username && (
              <p className="text-sm text-white/70 truncate">@{user.username}</p>
            )}
            {user?.bio && (
              <p className="text-sm text-white/80 mt-1 line-clamp-2">{user.bio}</p>
            )}
            {user?.createdAt && (
              <p className="text-xs text-white/50 mt-1.5">
                Member since {memberSince(user.createdAt)}
              </p>
            )}
          </div>
        </div>

        {/* stat pills */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { label: 'Ascents', value: stats?.totals?.totalAscents ?? '—', icon: Mountain },
            { label: 'Crags',   value: stats?.totals?.uniqueCrags  ?? '—', icon: Calendar },
            { label: 'Top grade', value: topGrade, icon: TrendingUp },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white/15 rounded-2xl p-3 text-center">
              <Icon className="w-4 h-4 text-white/60 mx-auto mb-1" />
              <div className="text-lg font-bold">{value}</div>
              <div className="text-[10px] text-white/60">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Account ─────────────────────────────────────────────────────── */}
      <div>
        <SectionTitle>Account</SectionTitle>
        <Card>
          <SettingRow
            icon={Edit2}
            label="Edit Profile"
            sublabel={user?.email}
            onClick={() => setSheet('edit')}
          />
          <div className="divider mx-4" />
          <SettingRow
            icon={Lock}
            label="Change Password"
            onClick={() => setSheet('password')}
          />
        </Card>
      </div>

      {/* ── Appearance ──────────────────────────────────────────────────── */}
      <div>
        <SectionTitle>Appearance</SectionTitle>
        <Card>
          <SettingRow
            icon={isDark ? Moon : Sun}
            label="Dark Mode"
            sublabel={isDark ? 'On' : 'Off'}
            onClick={toggle}
            right={
              <div
                className={cn(
                  'w-12 h-6.5 rounded-full transition-colors relative shrink-0',
                  isDark ? 'bg-rock-600' : 'bg-stone-200 dark:bg-stone-700',
                )}
                style={{ height: 26 }}
              >
                <div
                  className={cn(
                    'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
                    isDark ? 'translate-x-6' : 'translate-x-0.5',
                  )}
                />
              </div>
            }
          />
        </Card>
      </div>

      {/* ── Data ────────────────────────────────────────────────────────── */}
      <div>
        <SectionTitle>Your Data</SectionTitle>
        <Card>
          <SettingRow
            icon={Download}
            label="Export Ascents"
            sublabel="CSV or JSON"
            onClick={() => setSheet('export')}
          />
          <div className="divider mx-4" />
          <SettingRow
            icon={Shield}
            label="Privacy & Security"
            sublabel="Data is stored securely"
            onClick={() => {}}
            right={<span className="text-xs text-stone-400">Coming soon</span>}
          />
        </Card>
      </div>

      {/* ── Personal bests ──────────────────────────────────────────────── */}
      <PersonalBests />

      {/* ── Badges ──────────────────────────────────────────────────────── */}
      <BadgesGrid />

      {/* ── Account actions ─────────────────────────────────────────────── */}
      <div>
        <SectionTitle>Session</SectionTitle>
        <Card>
          <SettingRow
            icon={LogOut}
            label="Log out"
            onClick={handleLogout}
            danger
            right={null}
          />
        </Card>
      </div>

      <p className="text-center text-xs text-stone-300 dark:text-stone-600 pb-2">
        CragLog · Built for UK climbers
      </p>

      {/* ── Sheets ──────────────────────────────────────────────────────── */}
      {sheet === 'edit'     && user && <EditProfileSheet user={user} onClose={() => setSheet(null)} />}
      {sheet === 'password' && <ChangePasswordSheet onClose={() => setSheet(null)} />}
      {sheet === 'export'   && <ExportSheet onClose={() => setSheet(null)} />}
    </div>
  );
}
