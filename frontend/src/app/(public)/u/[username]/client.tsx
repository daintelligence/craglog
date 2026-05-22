'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Mountain, MapPin, TrendingUp, Heart, ExternalLink } from 'lucide-react';
import { kudosApi } from '@/lib/api';
import { getGradeColour } from '@/lib/gradeColours';
import { cn } from '@/lib/utils';
import type { PublicProfile } from '@/types';

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const ASCENT_LABEL: Record<string, string> = {
  onsight: 'OS', flash: 'FL', redpoint: 'RP', pinkpoint: 'PP',
  repeat: 'Rep', dog: 'Dog', second: '2nd', abseil: 'Ab', solo: 'Solo',
};
const ASCENT_COLOR: Record<string, string> = {
  onsight: 'bg-emerald-100 text-emerald-800',
  flash: 'bg-sky-100 text-sky-800',
  redpoint: 'bg-red-100 text-red-700',
  pinkpoint: 'bg-pink-100 text-pink-700',
  repeat: 'bg-stone-100 text-stone-600',
  dog: 'bg-stone-100 text-stone-500',
  second: 'bg-indigo-100 text-indigo-700',
  abseil: 'bg-purple-100 text-purple-700',
  solo: 'bg-amber-100 text-amber-800',
};

interface AscentRowProps {
  ascent: PublicProfile['recentAscents'][number];
}

function AscentRow({ ascent }: AscentRowProps) {
  const [count, setCount] = useState(ascent.kudos_count);
  const [liked, setLiked] = useState(false);

  const mut = useMutation({
    mutationFn: () => kudosApi.toggle(ascent.id),
    onSuccess: (data) => {
      setCount(data.kudosCount);
      setLiked(data.userHasKudos);
    },
  });

  const gradeClass = ascent.grade
    ? getGradeColour(ascent.grade, ascent.grade_system ?? '')
    : 'grade-default';

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-stone-900 dark:text-stone-50 truncate">
            {ascent.route_name}
          </span>
          {ascent.grade && (
            <span className={cn('grade-chip', gradeClass)}>{ascent.grade}</span>
          )}
          {ascent.ascent_type && (
            <span className={cn('inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold', ASCENT_COLOR[ascent.ascent_type] ?? 'bg-stone-100 text-stone-600')}>
              {ASCENT_LABEL[ascent.ascent_type] ?? ascent.ascent_type}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          {ascent.crag_name && (
            <span className="text-xs text-stone-400 truncate">{ascent.crag_name}</span>
          )}
          <span className="text-xs text-stone-300">·</span>
          <span className="text-xs text-stone-400">{formatDate(ascent.date)}</span>
        </div>
      </div>

      <button
        onClick={() => mut.mutate()}
        disabled={mut.isPending}
        className={cn(
          'flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-colors',
          liked
            ? 'text-red-500 bg-red-50 dark:bg-red-950/30'
            : 'text-stone-400 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20',
        )}
      >
        <Heart className={cn('w-3.5 h-3.5', liked && 'fill-current')} />
        {count > 0 && <span>{count}</span>}
      </button>
    </div>
  );
}

interface Props {
  username: string;
  initialProfile: PublicProfile | null;
}

export function PublicProfileClient({ username, initialProfile }: Props) {
  if (!initialProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4 text-center">
        <Mountain className="w-12 h-12 text-stone-300" />
        <h1 className="text-xl font-bold text-stone-700 dark:text-stone-300">Profile not found</h1>
        <p className="text-sm text-stone-500">@{username} hasn't set up their public profile yet.</p>
        <a href="/" className="text-sm font-semibold text-rock-600 hover:underline">CragLog →</a>
      </div>
    );
  }

  const p = initialProfile;

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-6">

      {/* ── Hero ── */}
      <div className="hero-gradient rounded-3xl p-6 text-white">
        <div className="flex items-start gap-4">
          {p.avatarUrl ? (
            <img
              src={p.avatarUrl}
              alt={p.name}
              className="w-16 h-16 rounded-2xl object-cover shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <span className="text-xl font-bold text-white">{initials(p.name)}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold truncate">{p.name}</h1>
            <p className="text-sm text-white/70">@{p.username}</p>
            {p.bio && <p className="text-sm text-white/80 mt-1 line-clamp-2">{p.bio}</p>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { label: 'Ascents',     value: p.totalAscents,          icon: Mountain  },
            { label: 'Crags',       value: p.uniqueCrags,           icon: MapPin    },
            { label: 'Top grade',   value: p.hardestGrade ?? '—',   icon: TrendingUp },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white/15 rounded-2xl p-3 text-center">
              <Icon className="w-4 h-4 text-white/60 mx-auto mb-1" />
              <div className="text-lg font-bold">{value}</div>
              <div className="text-[10px] text-white/60">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent ascents ── */}
      {p.recentAscents.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wider px-1 mb-2">
            Recent ascents
          </h2>
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 overflow-hidden divide-y divide-stone-100 dark:divide-stone-800">
            {p.recentAscents.map((a) => (
              <AscentRow key={a.id} ascent={a} />
            ))}
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <div className="text-center pt-2">
        <a href="/" className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-600 transition-colors">
          <span className="font-bold">▲</span>
          <span>CragLog · Log your climbs</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

    </div>
  );
}
