'use client';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { statsApi, badgesApi, cragsApi, ascentsApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { getStoredUser } from '@/lib/auth';
import { GradeChip } from '@/components/GradeChip';
import { SkeletonStats } from '@/components/Skeleton';
import { ASCENT_TYPE_LABELS } from '@/types';
import { cn } from '@/lib/utils';
import {
  PlusCircle, TrendingUp, Mountain, Calendar,
  ChevronRight, Flame, Award, MapPin, Navigation, Dumbbell,
} from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// ── Activity heatmap ──────────────────────────────────────────────────────────

function heatLevel(count: number): string {
  if (count === 0) return 'heat-0';
  if (count === 1) return 'heat-1';
  if (count === 2) return 'heat-2';
  if (count <= 4) return 'heat-3';
  return 'heat-4';
}

function ActivityHeatmap({ cells }: { cells: { date: string; count: number }[] }) {
  const weeks: { date: string; count: number }[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthLabels: string[] = new Array(52).fill('');
  for (let w = 0; w < weeks.length; w++) {
    const first = weeks[w][0];
    if (first) {
      const d = new Date(first.date);
      if (d.getDate() <= 7) monthLabels[w] = months[d.getMonth()];
    }
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <div className="inline-block min-w-full px-1">
        <div className="flex gap-0.5 mb-0.5">
          {monthLabels.map((m, i) => (
            <div key={i} className="w-3 text-[8px] text-stone-400 dark:text-stone-600 shrink-0">{m}</div>
          ))}
        </div>
        <div className="flex gap-0.5">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {week.map((cell, di) => (
                <div
                  key={di}
                  title={`${cell.date}: ${cell.count} climb${cell.count !== 1 ? 's' : ''}`}
                  className={cn('w-3 h-3 rounded-sm', cell.count === 0 ? 'heat-0' : heatLevel(cell.count))}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1 mt-2 text-[9px] text-stone-400 justify-end">
          <span>Less</span>
          {[0,1,2,3,4].map((l) => (
            <div key={l} className={cn('w-2.5 h-2.5 rounded-sm', heatLevel(l))} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

// ── Progression chart ─────────────────────────────────────────────────────────

function ProgressionChart({ data }: { data: { month: string; total: number; onsights: number }[] }) {
  if (!data?.length) return null;

  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.month + '-01').toLocaleDateString('en-GB', { month: 'short' }),
  }));

  return (
    <ResponsiveContainer width="100%" height={130}>
      <BarChart data={formatted} barSize={16} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e5e4" />
        <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: '#a8a29e' }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip
          cursor={{ fill: 'rgba(109,80,53,0.06)' }}
          contentStyle={{ borderRadius: 12, border: '1px solid #e7e5e4', fontSize: 11, padding: '6px 10px' }}
          formatter={(val: number, name: string) => [val, name === 'total' ? 'All ascents' : 'Onsights']}
        />
        <Bar dataKey="total" fill="#d0c5b3" radius={[4, 4, 0, 0]} />
        <Bar dataKey="onsights" fill="#6d5035" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Nearby crags ─────────────────────────────────────────────────────────────

function NearbyCrags() {
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (p) => setPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setDenied(true),
      { timeout: 8000, maximumAge: 5 * 60 * 1000 },
    );
  }, []);

  const { data: crags = [], isLoading } = useQuery({
    queryKey: ['nearby-crags', pos?.lat, pos?.lng],
    queryFn: () => cragsApi.nearby(pos!.lat, pos!.lng, 30),
    enabled: !!pos,
    staleTime: 5 * 60 * 1000,
  });

  if (denied || (!pos && !isLoading)) return null;
  if (isLoading || !crags.length) return null;

  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Navigation className="w-4 h-4 text-rock-500" />
        <h2 className="font-bold text-stone-900 dark:text-stone-100 text-sm">Near you</h2>
      </div>
      <div className="space-y-2">
        {crags.map((c: any) => (
          <Link
            key={c.id}
            href={`/crags/${c.id}`}
            className="flex items-center gap-3 hover:bg-stone-50 dark:hover:bg-stone-800/50 rounded-xl p-2 -mx-2 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-rock-100 dark:bg-rock-900/30 flex items-center justify-center shrink-0">
              <Mountain className="w-4 h-4 text-rock-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-stone-900 dark:text-stone-50 truncate">{c.name}</p>
              <p className="text-xs text-stone-400 capitalize">{c.rockType} · {c.regionName}</p>
            </div>
            <span className="text-xs text-stone-400 shrink-0 flex items-center gap-0.5">
              <MapPin className="w-3 h-3" />{c.distanceKm} km
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ── Grade pyramid ─────────────────────────────────────────────────────────────

const GRADE_COLOURS_CHART = [
  '#10b981','#84cc16','#f59e0b','#f97316','#ef4444','#b91c1c','#7c3aed','#1c1917',
];

function GradePyramid({ distribution }: { distribution: any[] }) {
  const sorted = [...distribution]
    .sort((a, b) => a.difficulty - b.difficulty)
    .slice(-12);

  const max = Math.max(...sorted.map((d) => d.count), 1);

  return (
    <div className="space-y-1.5">
      {sorted.map((d, i) => {
        const pct = (d.count / max) * 100;
        const colIdx = Math.min(Math.floor((i / sorted.length) * GRADE_COLOURS_CHART.length), GRADE_COLOURS_CHART.length - 1);
        return (
          <div key={d.grade} className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 w-8 text-right shrink-0">
              {d.grade}
            </span>
            <div className="flex-1 bg-stone-100 dark:bg-stone-800 rounded-full h-5 overflow-hidden">
              <div
                className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                style={{ width: `${Math.max(pct, 4)}%`, backgroundColor: GRADE_COLOURS_CHART[colIdx] }}
              >
                {d.count > 0 && (
                  <span className="text-[9px] font-bold text-white">{d.count}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const user = getStoredUser();
  const firstName = user?.name?.split(' ')[0] || 'Climber';

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats', 'dashboard'],
    queryFn: statsApi.dashboard,
  });
  const { data: earnedBadges = [] } = useQuery({
    queryKey: ['badges', 'mine'],
    queryFn: badgesApi.mine,
  });
  const { data: rawHeatmap = [] } = useQuery({
    queryKey: ['stats', 'heatmap'],
    queryFn: statsApi.heatmap,
    staleTime: 5 * 60 * 1000,
  });
  const todayStr = new Date().toISOString().slice(0, 10);
  const { data: gymRaw } = useQuery({
    queryKey: ['ascents-gym-today'],
    queryFn: () => ascentsApi.list({ startDate: todayStr, endDate: todayStr }),
    select: (d: any) => (d.ascents ?? []).filter((a: any) => a.gymStyle),
    staleTime: 30000,
  });
  const todayGym: any[] = gymRaw ?? [];

  // Fill 364-day grid from API data
  const heatmapCells = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const { date, count } of rawHeatmap as { date: string; count: number }[]) {
      counts[date] = count;
    }
    const cells: { date: string; count: number }[] = [];
    const now = new Date();
    for (let i = 363; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      cells.push({ date: key, count: counts[key] || 0 });
    }
    return cells;
  }, [rawHeatmap]);

  const totalThisYear = useMemo(() => {
    const year = new Date().getFullYear().toString();
    return heatmapCells.filter((c) => c.date.startsWith(year) && c.count > 0)
      .reduce((sum, c) => sum + c.count, 0);
  }, [heatmapCells]);

  const currentStreak = useMemo(() => {
    let streak = 0;
    const today = new Date().toISOString().slice(0, 10);
    const cells = [...heatmapCells].reverse();
    for (const c of cells) {
      if (c.date > today) continue;
      if (c.count > 0) streak++;
      else if (c.date !== today) break;
    }
    return streak;
  }, [heatmapCells]);

  if (statsLoading) return <SkeletonStats />;

  const totals    = stats?.totals;
  const recent    = stats?.recentAscents || [];
  const gradeDistr = stats?.gradeDistribution || [];
  const recentBadges = earnedBadges.slice(0, 3);

  const highestGrade = gradeDistr.length
    ? [...gradeDistr].sort((a, b) => b.difficulty - a.difficulty)[0]?.grade
    : '—';

  return (
    <div className="space-y-5 animate-fade-in pb-4">

      {/* ── Hero card ─────────────────────────────────────────────────── */}
      <div className="hero-gradient rounded-3xl p-5 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, white 0%, transparent 60%)' }} />
        <p className="text-white/70 text-sm font-medium mb-0.5">Hey, {firstName} 👋</p>
        <h1 className="text-2xl font-bold mb-4">Your climbing</h1>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'All time', value: totals?.totalAscents ?? 0, sub: 'climbs' },
            { label: 'This year', value: totalThisYear, sub: 'climbs' },
            { label: 'Top grade', value: highestGrade, sub: 'highest' },
          ].map(({ label, value, sub }) => (
            <div key={label} className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center">
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-[10px] text-white/70 font-medium mt-0.5">{sub}</p>
              <p className="text-[9px] text-white/50 uppercase tracking-wide">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Gym session card ──────────────────────────────────────────── */}
      {todayGym.length > 0 && (
        <Link href="/gym" className="card p-4 flex items-center gap-4 hover:border-amber-300 transition-colors active:scale-[0.99] block">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
            <Dumbbell className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-stone-900 dark:text-stone-50 text-sm">Gym session in progress</p>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {todayGym.length} {todayGym.length === 1 ? 'climb' : 'climbs'} ·{' '}
              {(() => {
                const grades = todayGym.map((a: any) => a.freeGrade).filter(Boolean);
                const best = grades.sort().at(-1);
                return best ? `best ${best}` : '';
              })()}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-300 shrink-0" />
        </Link>
      )}

      {/* ── Recent badges ─────────────────────────────────────────────── */}
      {recentBadges.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h2 className="font-bold text-stone-900 dark:text-stone-100 text-sm">Recent badges</h2>
            </div>
            <Link href="/badges" className="text-xs text-rock-600 dark:text-rock-400 font-semibold flex items-center gap-0.5">
              All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-none">
            {recentBadges.map(({ badge }: any) => (
              <div key={badge.id} className="flex flex-col items-center gap-1.5 shrink-0 w-16">
                <div className={cn(
                  'w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md ring-2',
                  badge.tier === 'gold'   && 'bg-gradient-to-br from-amber-300 to-amber-500 ring-amber-300',
                  badge.tier === 'silver' && 'bg-gradient-to-br from-stone-300 to-stone-400 ring-stone-300',
                  badge.tier === 'bronze' && 'bg-gradient-to-br from-orange-300 to-orange-500 ring-orange-300',
                  !badge.tier && 'bg-gradient-to-br from-rock-400 to-rock-600 ring-rock-300',
                )}>
                  {badge.icon || '🏅'}
                </div>
                <span className="text-[10px] text-center text-stone-600 dark:text-stone-400 font-semibold leading-tight">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Quick stats strip ─────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-2.5">
        {[
          { label: 'Crags',   value: totals?.uniqueCrags ?? 0,   icon: Mountain, color: 'text-summit-500' },
          { label: 'Routes',  value: totals?.uniqueRoutes ?? 0,  icon: TrendingUp, color: 'text-emerald-500' },
          { label: 'Days',    value: totals?.totalDays ?? 0,     icon: Calendar, color: 'text-amber-500' },
          { label: 'Streak',  value: currentStreak,              icon: Flame,    color: currentStreak > 0 ? 'text-orange-500' : 'text-stone-300' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-3 text-center">
            <Icon className={cn('w-4 h-4 mx-auto mb-1', color)} />
            <p className="text-lg font-bold text-stone-900 dark:text-stone-50 leading-none">{value}</p>
            <p className="text-[10px] text-stone-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Nearby crags ─────────────────────────────────────────────── */}
      <NearbyCrags />

      {/* ── Onsight breakdown ─────────────────────────────────────────── */}
      {stats?.onsightRate && stats.onsightRate.total > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-stone-900 dark:text-stone-100 text-sm">Ascent breakdown</h2>
            <Link href="/stats" className="text-xs text-rock-600 dark:text-rock-400 font-semibold flex items-center gap-0.5">
              Stats <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex gap-1 h-2.5 rounded-full overflow-hidden mb-2">
            {[
              { pct: (stats.onsightRate.onsights  / stats.onsightRate.total) * 100, color: 'bg-emerald-500' },
              { pct: (stats.onsightRate.flashes   / stats.onsightRate.total) * 100, color: 'bg-sky-500' },
              { pct: (stats.onsightRate.redpoints / stats.onsightRate.total) * 100, color: 'bg-red-400' },
            ].map(({ pct, color }, i) => pct > 0 && (
              <div key={i} className={cn('h-full rounded-full transition-all', color)} style={{ width: `${pct}%` }} />
            ))}
          </div>
          <div className="flex gap-4 text-xs text-stone-500 dark:text-stone-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />{stats.onsightRate.onsightRate}% OS</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />{stats.onsightRate.flashes} flash</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />{stats.onsightRate.redpoints} RP</span>
          </div>
        </div>
      )}

      {/* ── Activity heatmap ──────────────────────────────────────────── */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-stone-900 dark:text-stone-100 text-sm">Activity — 52 weeks</h2>
          <span className="text-xs text-stone-400">{heatmapCells.filter(c => c.count > 0).length} days out</span>
        </div>
        <ActivityHeatmap cells={heatmapCells} />
      </div>

      {/* ── Grade pyramid ─────────────────────────────────────────────── */}
      {gradeDistr.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-stone-900 dark:text-stone-100 text-sm">Grade pyramid</h2>
            <span className="text-xs text-stone-400">{gradeDistr.reduce((s: number, d: any) => s + d.count, 0)} total</span>
          </div>
          <GradePyramid distribution={gradeDistr} />
        </div>
      )}

      {/* ── Progression chart ────────────────────────────────────────── */}
      {stats?.progression?.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-stone-900 dark:text-stone-100 text-sm">Monthly activity</h2>
            <div className="flex items-center gap-3 text-[10px] text-stone-400">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-rock-200 dark:bg-rock-700 inline-block" />Total</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-rock-600 inline-block" />Onsight</span>
            </div>
          </div>
          <ProgressionChart data={stats.progression} />
        </div>
      )}

      {/* ── Recent climbs ─────────────────────────────────────────────── */}
      {recent.length > 0 && (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <h2 className="font-bold text-stone-900 dark:text-stone-100 text-sm">Recent climbs</h2>
            <Link href="/logbook" className="text-xs text-rock-600 dark:text-rock-400 font-semibold flex items-center gap-0.5">
              Logbook <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-stone-50 dark:divide-stone-800">
            {recent.slice(0, 5).map((a: any) => (
              <div key={a.id} className="px-4 py-3 flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-stone-900 dark:text-stone-100 truncate text-sm">{a.route_name}</p>
                  <p className="text-xs text-stone-400 truncate">{a.crag_name} · {formatDate(a.date)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <GradeChip grade={a.grade} gradeSystem={a.grade_system} size="sm" />
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-lg font-semibold capitalize',
                    `ascent-${a.ascent_type}`,
                  )}>
                    {ASCENT_TYPE_LABELS[a.ascent_type as keyof typeof ASCENT_TYPE_LABELS] || a.ascent_type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* ── Empty state ───────────────────────────────────────────────── */}
      {!statsLoading && (totals?.totalAscents ?? 0) === 0 && (
        <div className="card p-8 text-center">
          <div className="w-20 h-20 bg-rock-100 dark:bg-rock-900/30 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Mountain className="w-10 h-10 text-rock-400" />
          </div>
          <h3 className="font-bold text-stone-900 dark:text-stone-100 text-lg mb-2">Ready to climb?</h3>
          <p className="text-stone-500 dark:text-stone-400 text-sm mb-5 leading-relaxed">
            Log your first climb and start tracking your progression. Your grade pyramid and activity heatmap will appear here.
          </p>
          <Link href="/log" className="btn-primary inline-flex">
            <PlusCircle className="w-4 h-4" /> Log first climb
          </Link>
        </div>
      )}
    </div>
  );
}
