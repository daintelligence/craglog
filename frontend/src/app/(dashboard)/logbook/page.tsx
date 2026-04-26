'use client';
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ascentsApi } from '@/lib/api';
import { GradeChip } from '@/components/GradeChip';
import { SkeletonLogbook } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import { formatDate, today } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Ascent, AscentType } from '@/types';
import { ASCENT_TYPE_LABELS } from '@/types';
import {
  BookOpen, Search, RotateCcw, Pencil, Trash2, Star, X, Check,
  Mountain, Loader2, PlusCircle, SlidersHorizontal, Target,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const PAGE_SIZE = 25;
const ASCENT_TYPES: AscentType[] = ['onsight', 'flash', 'redpoint', 'pinkpoint', 'repeat', 'dog', 'second', 'solo'];
const CONDITIONS = ['Dry', 'Damp', 'Seeping', 'Wet', 'Windy', 'Hot', 'Cold'];

// ─── stored partners for autocomplete ────────────────────────────────────────
function getStoredPartners(): string[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem('craglog_partners') || '[]'); }
  catch { return []; }
}
function savePartner(name: string) {
  if (!name.trim() || typeof window === 'undefined') return;
  const list = getStoredPartners().filter((p) => p !== name.trim());
  list.unshift(name.trim());
  localStorage.setItem('craglog_partners', JSON.stringify(list.slice(0, 20)));
}

// ─── Edit sheet ───────────────────────────────────────────────────────────────

function EditModal({ ascent, onClose, onSaved }: { ascent: Ascent; onClose: () => void; onSaved: () => void }) {
  const qc = useQueryClient();
  const [ascentType, setAscentType] = useState<AscentType>(ascent.ascentType);
  const [date, setDate]             = useState(ascent.date);
  const [notes, setNotes]           = useState(ascent.notes || '');
  const [partner, setPartner]       = useState(ascent.partner || '');
  const [partnerFocus, setPartnerFocus] = useState(false);
  const [starRating, setStarRating] = useState(ascent.starRating || 0);
  const [conditions, setConditions] = useState(ascent.conditions || '');

  const suggestions = getStoredPartners().filter(
    (p) => p.toLowerCase().includes(partner.toLowerCase()) && p !== partner,
  );

  const updateMutation = useMutation({
    mutationFn: (data: any) => ascentsApi.update(ascent.id, data),
    onSuccess: () => {
      if (partner.trim()) savePartner(partner.trim());
      qc.invalidateQueries({ queryKey: ['ascents'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      onSaved();
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-stone-900 rounded-t-3xl w-full max-w-2xl p-5 space-y-4 animate-slide-up shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="w-10 h-1 bg-stone-200 dark:bg-stone-700 rounded-full mx-auto mb-1" />
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-stone-900 dark:text-stone-100 text-lg">Edit ascent</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Route info */}
        <div className="bg-stone-50 dark:bg-stone-800 rounded-2xl p-3 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-stone-900 dark:text-stone-100 text-sm truncate">{(ascent as any).route?.name || 'Route'}</p>
            <p className="text-xs text-stone-400 truncate">{(ascent as any).crag?.name || ''}</p>
          </div>
          {(ascent as any).route?.grade && (
            <GradeChip grade={(ascent as any).route.grade} gradeSystem={(ascent as any).route.gradeSystem} size="sm" />
          )}
        </div>

        {/* Style */}
        <div>
          <label className="label">Style</label>
          <div className="flex flex-wrap gap-2">
            {ASCENT_TYPES.slice(0, 6).map((t) => (
              <button key={t} onClick={() => setAscentType(t)}
                className={cn(
                  'px-3 py-2 rounded-xl text-xs font-semibold transition-all',
                  ascentType === t ? `ascent-${t} ring-2 ring-offset-1 ring-rock-400` : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400',
                )}>
                {ASCENT_TYPE_LABELS[t]}
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="label">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" max={today()} />
        </div>

        {/* Stars */}
        <div>
          <label className="label">Route quality</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} onClick={() => setStarRating(s === starRating ? 0 : s)} className="p-1">
                <Star className={cn('w-6 h-6', s <= starRating ? 'fill-amber-400 text-amber-400' : 'text-stone-200')} />
              </button>
            ))}
          </div>
        </div>

        {/* Conditions */}
        <div>
          <label className="label">Conditions</label>
          <div className="flex flex-wrap gap-2">
            {CONDITIONS.map((c) => (
              <button
                key={c}
                onClick={() => setConditions(conditions === c ? '' : c)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                  conditions === c
                    ? 'bg-rock-600 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400',
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Partner */}
        <div className="relative">
          <label className="label">Partner</label>
          <input
            value={partner}
            onChange={(e) => setPartner(e.target.value)}
            onFocus={() => setPartnerFocus(true)}
            onBlur={() => setTimeout(() => setPartnerFocus(false), 150)}
            className="input"
            placeholder="Climbing partner name"
          />
          {partnerFocus && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl shadow-lg z-10 overflow-hidden">
              {suggestions.slice(0, 5).map((s) => (
                <button
                  key={s}
                  onMouseDown={() => setPartner(s)}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="label">Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="input resize-none" rows={2} placeholder="Beta, feelings, what to work on…" />
        </div>

        <button
          onClick={() => updateMutation.mutate({ ascentType, date, notes: notes || undefined, partner: partner || undefined, starRating: starRating || undefined, conditions: conditions || undefined })}
          disabled={updateMutation.isPending}
          className="btn-primary w-full py-3"
        >
          {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          Save changes
        </button>
      </div>
    </div>
  );
}

// ─── Delete confirmation ──────────────────────────────────────────────────────

function DeleteConfirm({ ascent, onClose }: { ascent: Ascent; onClose: () => void }) {
  const qc = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: () => ascentsApi.delete(ascent.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ascents'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-stone-900 rounded-t-3xl w-full max-w-sm p-5 space-y-4 animate-slide-up shadow-2xl">
        <h3 className="font-bold text-stone-900 dark:text-stone-100 text-lg">Delete ascent?</h3>
        <p className="text-sm text-stone-500">
          This will permanently remove <strong>{(ascent as any).route?.name}</strong> from your logbook.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending} className="btn-danger flex-1">
            {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Day group header ─────────────────────────────────────────────────────────

function DayHeader({ date, count, crags }: { date: string; count: number; crags: string[] }) {
  return (
    <div className="flex items-center justify-between px-1 pt-3 pb-1">
      <div>
        <p className="text-sm font-bold text-stone-900 dark:text-stone-50">{formatDate(date)}</p>
        {crags.length > 0 && (
          <p className="text-xs text-stone-400">{crags.join(' · ')}</p>
        )}
      </div>
      <span className="text-xs text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full">
        {count} {count === 1 ? 'route' : 'routes'}
      </span>
    </div>
  );
}

// ─── Ascent row ───────────────────────────────────────────────────────────────

function AscentRow({ ascent, onEdit, onDelete, onTickAgain }: {
  ascent: Ascent;
  onEdit: () => void;
  onDelete: () => void;
  onTickAgain: () => void;
}) {
  const a = ascent as any;
  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-3.5 flex items-center gap-3">
      <div className="shrink-0">
        {a.route?.grade
          ? <GradeChip grade={a.route.grade} gradeSystem={a.route.gradeSystem} size="sm" />
          : <div className="w-10 h-6 bg-stone-100 rounded-lg" />
        }
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-stone-900 dark:text-stone-100 truncate text-sm leading-snug">
          {a.route?.name || 'Unknown route'}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {ascent.starRating != null && ascent.starRating > 0 && (
            <div className="flex gap-0.5">
              {Array.from({ length: ascent.starRating }).map((_, i) => (
                <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
          )}
          {ascent.conditions && (
            <span className="text-[10px] text-stone-400">{ascent.conditions}</span>
          )}
          {ascent.partner && (
            <span className="text-[10px] text-stone-400">w/ {ascent.partner}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <span className={cn('text-[10px] px-2 py-1 rounded-lg font-bold capitalize', `ascent-${ascent.ascentType}`)}>
          {ASCENT_TYPE_LABELS[ascent.ascentType as AscentType]?.split('/')[0] || ascent.ascentType}
        </span>
        <button onClick={onTickAgain} title="Log again"
          className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center hover:bg-rock-100 hover:text-rock-600 transition-colors">
          <RotateCcw className="w-3 h-3" />
        </button>
        <button onClick={onEdit} title="Edit"
          className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center hover:bg-summit-100 hover:text-summit-600 transition-colors">
          <Pencil className="w-3 h-3" />
        </button>
        <button onClick={onDelete} title="Delete"
          className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

// ─── Main logbook ─────────────────────────────────────────────────────────────

export default function LogbookPage() {
  const router = useRouter();
  const [search, setSearch]           = useState('');
  const [typeFilter, setTypeFilter]   = useState('');
  const [climbFilter, setClimbFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [editAscent, setEditAscent]   = useState<Ascent | null>(null);
  const [deleteAscent, setDeleteAscent] = useState<Ascent | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const queryParams = { limit: PAGE_SIZE, ...(typeFilter && { ascentType: typeFilter }), ...(climbFilter && { climbingType: climbFilter }) };

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['ascents', 'logbook', typeFilter, climbFilter],
    queryFn: ({ pageParam = 0 }) => ascentsApi.list({ ...queryParams, offset: (pageParam as number) * PAGE_SIZE }),
    getNextPageParam: (lastPage: any, pages) => {
      const total = lastPage?.total ?? 0;
      const loaded = pages.length * PAGE_SIZE;
      return loaded < total ? pages.length : undefined;
    },
    initialPageParam: 0,
  });

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage(); },
      { rootMargin: '200px' },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allAscents: Ascent[] = useMemo(
    () => data?.pages.flatMap((p: any) => p?.ascents || p || []) ?? [],
    [data],
  );
  const total: number = data?.pages[0]?.total ?? allAscents.length;

  const filtered = useMemo(() => search
    ? allAscents.filter((a: any) =>
        (a.route?.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (a.crag?.name  || '').toLowerCase().includes(search.toLowerCase()),
      )
    : allAscents,
  [allAscents, search]);

  // Group by date
  const grouped = useMemo(() => {
    const map = new Map<string, Ascent[]>();
    for (const a of filtered) {
      const day = a.date.slice(0, 10);
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(a);
    }
    return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a));
  }, [filtered]);

  const handleTickAgain = useCallback((a: Ascent) => {
    const route = (a as any).route;
    if (!route) return;
    router.push(`/log?routeId=${route.id}&cragId=${a.cragId}`);
  }, [router]);

  const hasFilters = typeFilter || climbFilter;

  return (
    <div className="space-y-4 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50">Logbook</h1>
          <p className="text-sm text-stone-400 mt-0.5">{total} ascent{total !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/projects" className="btn-secondary py-2.5 px-3 text-sm" title="Projects">
            <Target className="w-4 h-4" />
          </Link>
          <Link href="/log" className="btn-primary py-2.5 px-4 text-sm">
            <PlusCircle className="w-4 h-4" /> Log
          </Link>
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10 h-11"
            placeholder="Search routes, crags…"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-stone-400" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters((s) => !s)}
          className={cn('btn-secondary px-3 h-11 relative', hasFilters && 'bg-rock-100 text-rock-700 dark:bg-rock-900/30 dark:text-rock-400')}
        >
          <SlidersHorizontal className="w-4 h-4" />
          {hasFilters && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-rock-600 rounded-full text-[7px] text-white flex items-center justify-center font-bold">
              {[typeFilter, climbFilter].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-4 space-y-3 animate-slide-down">
          <div>
            <label className="label text-xs">Ascent style</label>
            <div className="flex flex-wrap gap-1.5">
              {[{label:'All',value:''}, {label:'Onsight',value:'onsight'}, {label:'Flash',value:'flash'}, {label:'Redpoint',value:'redpoint'}, {label:'Dog',value:'dog'}].map((o) => (
                <button key={o.value} onClick={() => setTypeFilter(o.value)}
                  className={cn('px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                    typeFilter === o.value ? 'bg-rock-600 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400',
                  )}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label text-xs">Climbing type</label>
            <div className="flex flex-wrap gap-1.5">
              {[{label:'All',value:''},{label:'Trad',value:'trad'},{label:'Sport',value:'sport'},{label:'Boulder',value:'boulder'}].map((o) => (
                <button key={o.value} onClick={() => setClimbFilter(o.value)}
                  className={cn('px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                    climbFilter === o.value ? 'bg-rock-600 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400',
                  )}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          {hasFilters && (
            <button onClick={() => { setTypeFilter(''); setClimbFilter(''); }} className="text-xs text-rock-600 dark:text-rock-400 font-semibold">
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <SkeletonLogbook count={6} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-8 h-8" />}
          title="No climbs here yet"
          body={hasFilters ? 'Try clearing your filters.' : 'Start logging your climbs and they\'ll appear here.'}
          cta={hasFilters ? undefined : 'Log a climb'}
          ctaHref={hasFilters ? undefined : '/log'}
          ctaOnClick={hasFilters ? () => { setTypeFilter(''); setClimbFilter(''); } : undefined}
        />
      ) : (
        <div className="space-y-1">
          {grouped.map(([date, dayAscents]) => {
            const crags = Array.from(new Set(dayAscents.map((a: any) => a.crag?.name).filter(Boolean))) as string[];
            return (
              <div key={date}>
                <DayHeader date={date} count={dayAscents.length} crags={crags} />
                <div className="space-y-2">
                  {dayAscents.map((a) => (
                    <AscentRow
                      key={a.id}
                      ascent={a}
                      onEdit={() => setEditAscent(a)}
                      onDelete={() => setDeleteAscent(a)}
                      onTickAgain={() => handleTickAgain(a)}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="h-4" />
          {isFetchingNextPage && (
            <div className="flex justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
            </div>
          )}
          {!hasNextPage && allAscents.length > 0 && (
            <p className="text-center text-xs text-stone-300 dark:text-stone-600 py-4">
              All {total} ascents loaded
            </p>
          )}
        </div>
      )}

      {editAscent   && <EditModal ascent={editAscent} onClose={() => setEditAscent(null)} onSaved={() => {}} />}
      {deleteAscent && <DeleteConfirm ascent={deleteAscent} onClose={() => setDeleteAscent(null)} />}
    </div>
  );
}
