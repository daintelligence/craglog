'use client';
import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ascentsApi, badgesApi } from '@/lib/api';
import { today } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { CheckCircle2, ChevronUp, ChevronDown, Dumbbell, Trash2, Award } from 'lucide-react';

// ── grades ────────────────────────────────────────────────────────────────────

const FRENCH = ['4','4+','5','5+','6a','6a+','6b','6b+','6c','6c+','7a','7a+','7b','7b+','7c','7c+','8a','8a+','8b','8b+','8c','8c+','9a'];
const VGRADES = ['VB','V0','V0+','V1','V2','V3','V4','V5','V6','V7','V8','V9','V10','V11','V12','V13'];

type Style = 'lead' | 'toprope' | 'autobelay' | 'boulder';
type GradeSystem = 'rope' | 'boulder';

const STYLES: { value: Style; label: string; short: string; colour: string; system: GradeSystem }[] = [
  { value: 'lead',      label: 'Lead',      short: 'Lead', colour: 'bg-rock-600 active:bg-rock-700 shadow-rock-200 dark:shadow-rock-900',       system: 'rope'    },
  { value: 'toprope',   label: 'Top rope',  short: 'Top',  colour: 'bg-summit-600 active:bg-summit-700 shadow-summit-200 dark:shadow-summit-900', system: 'rope'    },
  { value: 'autobelay', label: 'Autobelay', short: 'Auto', colour: 'bg-sky-600 active:bg-sky-700 shadow-sky-200 dark:shadow-sky-900',             system: 'rope'    },
  { value: 'boulder',   label: 'Boulder',   short: 'Bldr', colour: 'bg-amber-600 active:bg-amber-700 shadow-amber-200 dark:shadow-amber-900',     system: 'boulder' },
];

// ── drum picker ───────────────────────────────────────────────────────────────

const ITEM_H = 60;

function GradeDrum({ grades, value, onChange }: {
  grades: string[];
  value: string;
  onChange: (g: string) => void;
}) {
  const listRef  = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevKey  = useRef(grades[0]);

  const scrollTo = useCallback((i: number, smooth = true) => {
    listRef.current?.scrollTo({ top: i * ITEM_H, behavior: smooth ? 'smooth' : 'instant' });
  }, []);

  useEffect(() => {
    if (prevKey.current === grades[0]) return;
    prevKey.current = grades[0];
    const i = Math.max(0, grades.indexOf(value));
    scrollTo(i, false);
  }, [grades, value, scrollTo]);

  useEffect(() => {
    scrollTo(grades.indexOf(value), false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleScroll() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const top = listRef.current?.scrollTop ?? 0;
      const snapped = Math.round(top / ITEM_H);
      const clamped = Math.max(0, Math.min(grades.length - 1, snapped));
      onChange(grades[clamped]);
      scrollTo(clamped);
    }, 80);
  }

  function step(dir: number) {
    const cur = grades.indexOf(value);
    const next = Math.max(0, Math.min(grades.length - 1, cur + dir));
    onChange(grades[next]);
    scrollTo(next);
  }

  return (
    <div className="flex items-center gap-4">
      <button onClick={() => step(-1)} className="p-3 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 active:scale-90 transition-transform">
        <ChevronUp className="w-7 h-7" />
      </button>

      <div className="relative w-40 overflow-hidden" style={{ height: ITEM_H * 3 }}>
        <div className="absolute inset-x-0 rounded-2xl bg-rock-50 dark:bg-rock-900/30 border-2 border-rock-400 dark:border-rock-500 pointer-events-none z-10"
          style={{ top: ITEM_H, height: ITEM_H }} />
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white dark:from-stone-950 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white dark:from-stone-950 to-transparent pointer-events-none z-10" />
        <div
          ref={listRef}
          onScroll={handleScroll}
          className="h-full overflow-y-scroll snap-y snap-mandatory"
          style={{ scrollbarWidth: 'none' }}
        >
          <div style={{ height: ITEM_H }} />
          {grades.map((g) => (
            <div
              key={g}
              onClick={() => { onChange(g); scrollTo(grades.indexOf(g)); }}
              style={{ height: ITEM_H }}
              className={cn(
                'flex items-center justify-center snap-center cursor-pointer transition-all duration-100',
                g === value
                  ? 'text-rock-600 dark:text-rock-400 font-black text-4xl'
                  : 'text-stone-400 dark:text-stone-600 font-semibold text-2xl',
              )}
            >
              {g}
            </div>
          ))}
          <div style={{ height: ITEM_H }} />
        </div>
      </div>

      <button onClick={() => step(1)} className="p-3 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 active:scale-90 transition-transform">
        <ChevronDown className="w-7 h-7" />
      </button>
    </div>
  );
}

// ── badge toast ───────────────────────────────────────────────────────────────

const BADGE_ICONS: Record<string, string> = {
  mountain: '⛰️', trophy: '🏆', gear: '⚙️', bolt: '⚡', eye: '👁️',
  map: '🗺️', star: '⭐', flame: '🔥', layers: '📚', shuffle: '🔀',
  zap: '⚡', 'map-pin': '📍', list: '📋', default: '🏅',
};

function BadgeToast({ badge, onDone }: { badge: any; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[2000] animate-slide-up">
      <div className="bg-stone-900 dark:bg-stone-800 text-white rounded-2xl px-5 py-3.5 shadow-2xl flex items-center gap-3 min-w-[220px]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xl shrink-0">
          {BADGE_ICONS[badge.icon] || BADGE_ICONS.default}
        </div>
        <div>
          <p className="text-xs text-stone-400 font-medium">Badge unlocked!</p>
          <p className="font-bold text-sm leading-tight">{badge.name}</p>
        </div>
        <Award className="w-4 h-4 text-amber-400 shrink-0" />
      </div>
    </div>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────

export default function GymPage() {
  const qc = useQueryClient();

  const [ropeGrade,    setRopeGrade]    = useState('6b');
  const [boulderGrade, setBoulderGrade] = useState('V3');
  const [activeStyle,  setActiveStyle]  = useState<Style>('lead');
  const [gradeSystem,  setGradeSystem]  = useState<GradeSystem>('rope');
  const [flash,        setFlash]        = useState<Style | null>(null);
  const [busy,         setBusy]         = useState(false);
  const [toastBadge,   setToastBadge]   = useState<any | null>(null);

  const grades   = gradeSystem === 'boulder' ? VGRADES : FRENCH;
  const grade    = gradeSystem === 'boulder' ? boulderGrade : ropeGrade;
  const setGrade = gradeSystem === 'boulder' ? setBoulderGrade : setRopeGrade;

  const todayStr = today();
  const { data: raw = [] } = useQuery({
    queryKey: ['ascents-gym-today'],
    queryFn: () => ascentsApi.list({ startDate: todayStr, endDate: todayStr }),
    select: (d: any) => (d.ascents ?? []).filter((a: any) => a.gymStyle),
  });
  const todayAscents = raw as any[];
  const sessionCount = todayAscents.length;

  // Badge detection
  const prevBadgeCountRef = useRef<number | null>(null);
  const { data: earnedBadges = [] } = useQuery({
    queryKey: ['badges', 'mine'],
    queryFn: badgesApi.mine,
    refetchInterval: 8000,
  });
  useEffect(() => {
    if (prevBadgeCountRef.current === null) {
      prevBadgeCountRef.current = earnedBadges.length;
      return;
    }
    if (earnedBadges.length > prevBadgeCountRef.current) {
      const newBadge = earnedBadges[earnedBadges.length - 1];
      setToastBadge(newBadge?.badge ?? newBadge);
    }
    prevBadgeCountRef.current = earnedBadges.length;
  }, [earnedBadges]);

  // Quick-grade chips — most-logged grades this session
  const quickGrades = useMemo(() => {
    const counts: Record<string, number> = {};
    todayAscents.forEach((a: any) => {
      if (a.freeGrade) counts[a.freeGrade] = (counts[a.freeGrade] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([g]) => g)
      .filter((g) => grades.includes(g));
  }, [todayAscents, grades]);

  // Swipe to switch grade system
  const swipeOrigin = useRef<{ x: number; y: number } | null>(null);
  function onTouchStart(e: React.TouchEvent) {
    swipeOrigin.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (!swipeOrigin.current) return;
    const dx = e.changedTouches[0].clientX - swipeOrigin.current.x;
    const dy = Math.abs(e.changedTouches[0].clientY - swipeOrigin.current.y);
    swipeOrigin.current = null;
    if (Math.abs(dx) < 50 || dy > Math.abs(dx)) return;
    setGradeSystem(dx < 0 ? 'boulder' : 'rope');
  }

  async function log(style: Style) {
    if (busy) return;
    const newSystem = STYLES.find((s) => s.value === style)!.system;
    setActiveStyle(style);
    setGradeSystem(newSystem);
    if (newSystem !== gradeSystem) return; // just switched system, don't log

    setBusy(true);
    setFlash(style);
    const logGrade = newSystem === 'boulder' ? boulderGrade : ropeGrade;
    try {
      await ascentsApi.gymLog({ grade: logGrade, style, date: todayStr });
      qc.invalidateQueries({ queryKey: ['ascents-gym-today'] });
      qc.invalidateQueries({ queryKey: ['ascents'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      qc.invalidateQueries({ queryKey: ['badges', 'mine'] });
    } finally {
      setTimeout(() => { setFlash(null); setBusy(false); }, 600);
    }
  }

  async function undoLast() {
    const last = todayAscents[todayAscents.length - 1];
    if (!last) return;
    await ascentsApi.delete(last.id);
    qc.invalidateQueries({ queryKey: ['ascents-gym-today'] });
  }

  const byStyle = STYLES.reduce<Record<string, number>>((acc, s) => {
    acc[s.value] = todayAscents.filter((a: any) => a.gymStyle === s.value).length;
    return acc;
  }, {});

  return (
    <div className="flex flex-col items-center gap-5 pt-1 pb-6 min-h-[calc(100vh-160px)]">

      {/* Header */}
      <div className="w-full text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <Dumbbell className="w-5 h-5 text-stone-400" />
          <h1 className="text-xl font-bold text-stone-900 dark:text-stone-50">Gym session</h1>
        </div>
        {sessionCount > 0 ? (
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-2xl font-black text-rock-600">{sessionCount}</span>
            <span className="text-sm text-stone-500">
              {sessionCount === 1 ? 'climb' : 'climbs'} ·{' '}
              {STYLES.filter((s) => byStyle[s.value] > 0)
                .map((s) => `${byStyle[s.value]} ${s.short.toLowerCase()}`)
                .join(' · ')}
            </span>
          </div>
        ) : (
          <p className="text-sm text-stone-400">Scroll grade · swipe for V · tap style to log</p>
        )}
      </div>

      {/* Grade system toggle + drum */}
      <div
        className="flex flex-col items-center gap-3"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Rope / Boulder pill */}
        <div className="flex bg-stone-100 dark:bg-stone-800 rounded-full p-1 gap-1">
          {(['rope', 'boulder'] as const).map((sys) => (
            <button
              key={sys}
              onClick={() => setGradeSystem(sys)}
              className={cn(
                'px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200',
                gradeSystem === sys
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-50 shadow-sm'
                  : 'text-stone-400 dark:text-stone-500',
              )}
            >
              {sys === 'rope' ? 'French' : 'V grade'}
            </button>
          ))}
        </div>

        <GradeDrum grades={grades} value={grade} onChange={setGrade} />

        {/* Quick-grade chips */}
        {quickGrades.length > 0 && (
          <div className="flex gap-2 flex-wrap justify-center">
            {quickGrades.map((g) => (
              <button
                key={g}
                onClick={() => setGrade(g)}
                className={cn(
                  'px-3 py-1 rounded-full text-sm font-bold border-2 transition-all',
                  grade === g
                    ? 'border-rock-500 bg-rock-50 dark:bg-rock-900/30 text-rock-600 dark:text-rock-400'
                    : 'border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400',
                )}
              >
                {g}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Style buttons — 2×2 grid */}
      <div className="w-full grid grid-cols-2 gap-3 px-1">
        {STYLES.map((s) => {
          const isActive = activeStyle === s.value;
          return (
            <div key={s.value} className="relative">
              <button
                onClick={() => log(s.value)}
                disabled={busy && flash === s.value}
                className={cn(
                  'w-full h-[88px] rounded-2xl text-white font-bold shadow-lg',
                  'transition-all duration-150 active:scale-95',
                  'flex flex-col items-center justify-center gap-1',
                  s.colour,
                  isActive && 'ring-4 ring-white/60 scale-[1.03]',
                )}
              >
                <span className="text-3xl font-black leading-none">{s.short}</span>
                <span className="text-xs font-medium opacity-80">{s.label}</span>
              </button>

              <div className={cn(
                'absolute inset-0 rounded-2xl flex items-center justify-center',
                'bg-emerald-500 transition-all duration-300',
                flash === s.value ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none',
              )}>
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Undo */}
      {sessionCount > 0 && (
        <button onClick={undoLast} className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-red-500 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
          Undo last
        </button>
      )}

      {/* Recent climbs */}
      {sessionCount > 0 && (
        <div className="w-full space-y-2">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-wide">Today</p>
          {[...todayAscents].reverse().slice(0, 6).map((a: any) => (
            <div key={a.id} className="card px-4 py-2.5 flex items-center gap-3">
              <span className="font-black text-xl text-rock-600 w-14">{a.freeGrade}</span>
              <span className="text-sm text-stone-500 capitalize flex-1">
                {a.gymStyle === 'toprope' ? 'Top rope' : a.gymStyle}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Badge unlock toast */}
      {toastBadge && (
        <BadgeToast badge={toastBadge} onDone={() => setToastBadge(null)} />
      )}
    </div>
  );
}
