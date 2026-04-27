'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ascentsApi } from '@/lib/api';
import { today } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { CheckCircle2, ChevronUp, ChevronDown, Dumbbell, Trash2 } from 'lucide-react';

// ── grades ────────────────────────────────────────────────────────────────────

const FRENCH = ['4','4+','5','5+','6a','6a+','6b','6b+','6c','6c+','7a','7a+','7b','7b+','7c','7c+','8a','8a+','8b','8b+','8c','8c+','9a'];
const VGRADES = ['VB','V0','V0+','V1','V2','V3','V4','V5','V6','V7','V8','V9','V10','V11','V12','V13'];

type Style = 'lead' | 'toprope' | 'autobelay' | 'boulder';

const STYLES: { value: Style; label: string; short: string; colour: string }[] = [
  { value: 'lead',      label: 'Lead',      short: 'Lead', colour: 'bg-rock-600 active:bg-rock-700 shadow-rock-200 dark:shadow-rock-900' },
  { value: 'toprope',   label: 'Top rope',  short: 'Top',  colour: 'bg-summit-600 active:bg-summit-700 shadow-summit-200 dark:shadow-summit-900' },
  { value: 'autobelay', label: 'Autobelay', short: 'Auto', colour: 'bg-sky-600 active:bg-sky-700 shadow-sky-200 dark:shadow-sky-900' },
  { value: 'boulder',   label: 'Boulder',   short: 'Bldr', colour: 'bg-amber-600 active:bg-amber-700 shadow-amber-200 dark:shadow-amber-900' },
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

  // Jump to matching grade or sensible default when grade list changes
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

// ── main ──────────────────────────────────────────────────────────────────────

export default function GymPage() {
  const qc = useQueryClient();

  // Grade state — separate for rope vs boulder so switching back remembers
  const [ropeGrade,    setRopeGrade]    = useState('6b');
  const [boulderGrade, setBoulderGrade] = useState('V3');
  const [activeStyle,  setActiveStyle]  = useState<Style>('lead');
  const [flash,        setFlash]        = useState<Style | null>(null);
  const [busy,         setBusy]         = useState(false);

  const isBoulder = activeStyle === 'boulder';
  const grades    = isBoulder ? VGRADES : FRENCH;
  const grade     = isBoulder ? boulderGrade : ropeGrade;
  const setGrade  = isBoulder ? setBoulderGrade : setRopeGrade;

  const todayStr = today();
  const { data: raw = [] } = useQuery({
    queryKey: ['ascents-gym-today'],
    queryFn: () => ascentsApi.list({ startDate: todayStr, endDate: todayStr }),
    select: (d: any) => (d.ascents ?? []).filter((a: any) => a.gymStyle),
  });
  const todayAscents = raw as any[];
  const sessionCount = todayAscents.length;

  async function log(style: Style) {
    if (busy) return;
    setActiveStyle(style);
    // Switching grade system — just update selection, don't log
    if ((style === 'boulder') !== isBoulder) return;

    setBusy(true);
    setFlash(style);
    try {
      await ascentsApi.gymLog({ grade, style, date: todayStr });
      qc.invalidateQueries({ queryKey: ['ascents-gym-today'] });
      qc.invalidateQueries({ queryKey: ['ascents'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
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
          <p className="text-sm text-stone-400">Scroll to your grade, tap a style to log</p>
        )}
      </div>

      {/* Grade drum */}
      <GradeDrum grades={grades} value={grade} onChange={setGrade} />

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

              {/* Success flash overlay */}
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
    </div>
  );
}
