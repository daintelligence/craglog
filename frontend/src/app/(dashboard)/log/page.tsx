'use client';
import { useState, useCallback, useEffect, useMemo, Suspense } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { cragsApi, ascentsApi, routesApi } from '@/lib/api';
import { queueAscent } from '@/lib/offlineQueue';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useOfflineQueue } from '@/hooks/useOfflineQueue';
import { today } from '@/lib/utils';
import {
  getActiveSession, setActiveSession, clearActiveSession,
  getRecentCrags, addRecentCrag, getFavouriteCrags, toggleFavouriteCrag, isFavouriteCrag,
} from '@/lib/sessionStore';
import { GradeChip } from '@/components/GradeChip';
import type { Crag, Buttress, Route, AscentType, ClimbingType, CreateAscentPayload } from '@/types';
import { ASCENT_TYPE_LABELS, UK_TRAD_GRADES, FRENCH_GRADES } from '@/types';
import {
  MapPin, Navigation, Search, Check, ChevronRight, RotateCcw, Star, Loader2,
  Heart, Clock, Zap, Filter, X, PlusCircle, Mountain,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Step = 'crag' | 'buttress' | 'route' | 'style' | 'done';

const ASCENT_TYPES: AscentType[] = ['onsight', 'flash', 'redpoint', 'pinkpoint', 'repeat', 'dog', 'second'];
const ASCENT_COLORS: Record<string, string> = {
  onsight:   'bg-emerald-500 text-white',
  flash:     'bg-sky-500 text-white',
  redpoint:  'bg-red-500 text-white',
  pinkpoint: 'bg-pink-500 text-white',
  repeat:    'bg-stone-400 text-white',
  dog:       'bg-stone-300 text-stone-700',
  second:    'bg-indigo-400 text-white',
};

const CLIMB_TYPE_ICONS: Record<string, string> = {
  trad: '🪢', sport: '🔩', boulder: '🪨', mixed: '❄️', alpine: '🏔️', dws: '🌊',
};

function LogPageInner() {
  const qc = useQueryClient();
  const searchParams = useSearchParams();

  const { lat, lng, loading: gpsLoading, error: gpsError, refresh: refreshGps } = useGeolocation(true);
  const { isOnline, refreshCount } = useOfflineQueue();

  const [step, setStep]                   = useState<Step>('crag');
  const [selectedCrag, setSelectedCrag]   = useState<Crag | null>(null);
  const [selectedButtress, setSelectedButtress] = useState<Buttress | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [ascentType, setAscentType]       = useState<AscentType>('onsight');
  const [date, setDate]                   = useState(today());
  const [partner, setPartner]             = useState('');
  const [notes, setNotes]                 = useState('');
  const [starRating, setStarRating]       = useState(0);
  const [cragSearch, setCragSearch]       = useState('');
  const [routeSearch, setRouteSearch]     = useState('');
  const [newBadges, setNewBadges]         = useState<any[]>([]);
  const [savedOffline, setSavedOffline]   = useState(false);
  const [freeRouteName, setFreeRouteName] = useState('');
  const [freeGrade, setFreeGrade]         = useState('');
  const [showFreeForm, setShowFreeForm]   = useState(false);
  const [climbTypeFilter, setClimbTypeFilter] = useState<ClimbingType | ''>('');
  const [sessionCrag, setSessionCrag]     = useState<Crag | null>(null);
  const [recentCrags, setRecentCrags]     = useState<Crag[]>([]);
  const [favCrags, setFavCrags]           = useState<Crag[]>([]);
  const [globalRouteSearch, setGlobalRouteSearch] = useState('');
  const [showGlobalSearch, setShowGlobalSearch]   = useState(false);
  const [sessionLog, setSessionLog] = useState<{routeName: string; grade: string; gradeSystem?: string; ascentType: AscentType; height?: number}[]>([]);

  // Load session + recents on mount
  useEffect(() => {
    const session = getActiveSession();
    if (session) setSessionCrag(session.crag);
    setRecentCrags(getRecentCrags());
    setFavCrags(getFavouriteCrags());
  }, []);

  // Handle deep-link from logbook tick-again
  const prefillRouteId = searchParams.get('routeId');
  const prefillCragId  = searchParams.get('cragId');

  // Crag search
  const { data: cragData, isLoading: cragsLoading } = useQuery({
    queryKey: ['crags', cragSearch, lat, lng],
    queryFn: () => cragsApi.search(
      lat && !cragSearch
        ? { lat, lng, radiusKm: 50, limit: 10 }
        : { q: cragSearch || undefined, limit: 20 },
    ),
    enabled: step === 'crag' && (!!cragSearch || !!lat),
  });

  // Global route search
  const { data: globalRouteResults = [], isLoading: globalSearchLoading } = useQuery({
    queryKey: ['routes-global-search', globalRouteSearch],
    queryFn: () => routesApi.search(globalRouteSearch),
    enabled: showGlobalSearch && globalRouteSearch.trim().length >= 2,
    staleTime: 30000,
  });

  // Buttresses
  const { data: buttresses = [], isLoading: buttressLoading } = useQuery({
    queryKey: ['buttresses', selectedCrag?.id],
    queryFn: () => cragsApi.getButtresses(selectedCrag!.id),
    enabled: !!selectedCrag && step === 'buttress',
  });

  const logMutation = useMutation({
    mutationFn: (payload: CreateAscentPayload) => ascentsApi.create(payload),
    onSuccess: (data) => {
      setNewBadges(data.newBadges || []);
      setSessionLog((prev) => [...prev, {
        routeName: showFreeForm ? freeRouteName : (selectedRoute?.name ?? ''),
        grade: showFreeForm ? freeGrade : (selectedRoute?.grade ?? ''),
        gradeSystem: selectedRoute?.gradeSystem,
        ascentType,
        height: (selectedRoute as any)?.heightMetres ?? (selectedRoute as any)?.height,
      }]);
      setStep('done');
      qc.invalidateQueries({ queryKey: ['ascents'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      qc.invalidateQueries({ queryKey: ['badges'] });
    },
  });

  const selectCrag = useCallback((crag: Crag) => {
    setSelectedCrag(crag);
    setActiveSession(crag);
    addRecentCrag(crag);
    setRecentCrags(getRecentCrags());
    setStep('buttress');
  }, []);

  const selectGlobalRoute = useCallback((route: Route) => {
    const crag = route.buttress?.crag as Crag | undefined;
    if (crag) {
      setSelectedCrag(crag);
      addRecentCrag(crag);
    }
    setSelectedButtress(route.buttress as Buttress);
    setSelectedRoute(route);
    setShowGlobalSearch(false);
    setGlobalRouteSearch('');
    setStep('style');
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selectedCrag) return;

    const payload: any = {
      cragId: selectedCrag.id,
      ascentType,
      date,
      partner: partner || undefined,
      notes: notes || undefined,
      starRating: starRating || undefined,
    };

    if (showFreeForm) {
      payload.freeText = { routeName: freeRouteName, grade: freeGrade };
    } else {
      if (!selectedRoute) return;
      payload.routeId = selectedRoute.id;
    }

    if (isOnline) {
      logMutation.mutate(payload);
    } else {
      await queueAscent({
        ...payload,
        _routeName: showFreeForm ? freeRouteName : selectedRoute?.name,
        _cragName: selectedCrag?.name,
        _grade: showFreeForm ? freeGrade : selectedRoute?.grade,
      } as any);
      setSavedOffline(true);
      setSessionLog((prev) => [...prev, {
        routeName: showFreeForm ? freeRouteName : (selectedRoute?.name ?? ''),
        grade: showFreeForm ? freeGrade : (selectedRoute?.grade ?? ''),
        gradeSystem: selectedRoute?.gradeSystem,
        ascentType,
        height: (selectedRoute as any)?.heightMetres,
      }]);
      setStep('done');
      refreshCount();
    }
  }, [selectedRoute, selectedCrag, ascentType, date, partner, notes, starRating, isOnline, logMutation, refreshCount, showFreeForm, freeRouteName, freeGrade]);

  const reset = () => {
    setStep('crag');
    setSelectedButtress(null);
    setSelectedRoute(null);
    setAscentType('onsight');
    setPartner(''); setNotes(''); setStarRating(0);
    setDate(today());
    setNewBadges([]); setSavedOffline(false);
    setShowFreeForm(false); setFreeRouteName(''); setFreeGrade('');
    setRouteSearch(''); setClimbTypeFilter('');
    // keep selectedCrag for session
  };

  const resetFull = () => { reset(); setSelectedCrag(null); setSessionLog([]); clearActiveSession(); };

  // Routes filtered for display
  const allRoutes: Route[] = useMemo(() => {
    const routes = (selectedButtress as any)?.routes ||
      (buttresses as any[]).find((b: any) => b.id === selectedButtress?.id)?.routes || [];
    return routes;
  }, [selectedButtress, buttresses]);

  const filteredRoutes = useMemo(() => {
    return allRoutes.filter((r) => {
      if (climbTypeFilter && r.climbingType !== climbTypeFilter) return false;
      if (routeSearch && !r.name.toLowerCase().includes(routeSearch.toLowerCase())) return false;
      return true;
    });
  }, [allRoutes, climbTypeFilter, routeSearch]);

  const STEPS: Step[] = ['crag', 'buttress', 'route', 'style'];
  const stepIdx = STEPS.indexOf(step);

  // ── Done screen ────────────────────────────────────────────────────────────
  if (step === 'done') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[55vh] text-center gap-5 px-4 animate-fade-in">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center animate-bounce-in">
          <Check className="w-10 h-10 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50">
            {savedOffline ? 'Saved Offline' : 'Logged! 🎉'}
          </h2>
          <p className="text-stone-500 mt-1 text-sm">
            {showFreeForm ? freeRouteName : selectedRoute?.name}
            {(showFreeForm ? freeGrade : selectedRoute?.grade) && (
              <> — <GradeChip
                grade={showFreeForm ? freeGrade : selectedRoute!.grade}
                gradeSystem={selectedRoute?.gradeSystem}
                size="sm"
              /></>
            )}
          </p>
          {savedOffline && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Will sync when you're back online.</p>
          )}
        </div>

        {newBadges.length > 0 && (
          <div className="card p-5 w-full max-w-sm">
            <p className="text-sm font-bold text-stone-700 dark:text-stone-300 mb-3">🏅 New badge{newBadges.length > 1 ? 's' : ''} earned!</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {newBadges.map((b) => (
                <div key={b.id} className="animate-badge-pop flex flex-col items-center gap-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center text-2xl shadow-md">
                    {b.icon || '🏅'}
                  </div>
                  <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">{b.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Session summary — shows after 2+ routes */}
        {sessionLog.length >= 2 && (() => {
          const maxGrade = sessionLog.reduce((best, r) => {
            // prefer the current route's grade system for comparison
            return !best.grade || r.grade > best.grade ? r : best;
          }, sessionLog[0]);
          const totalHeight = sessionLog.reduce((sum, r) => sum + (r.height || 0), 0);
          const bestStyle = sessionLog.some((r) => r.ascentType === 'onsight')
            ? 'onsight' : sessionLog.some((r) => r.ascentType === 'flash') ? 'flash' : 'redpoint';

          return (
            <div className="card p-4 w-full max-w-sm text-left">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">
                Session at {sessionCrag?.name ?? 'this crag'}
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-stone-50 dark:bg-stone-800/50 rounded-xl p-2.5">
                  <p className="text-lg font-bold text-stone-900 dark:text-stone-50">{sessionLog.length}</p>
                  <p className="text-[10px] text-stone-400">routes</p>
                </div>
                <div className="bg-stone-50 dark:bg-stone-800/50 rounded-xl p-2.5">
                  <p className="text-sm font-bold text-stone-900 dark:text-stone-50">{maxGrade.grade || '—'}</p>
                  <p className="text-[10px] text-stone-400">top grade</p>
                </div>
                {totalHeight > 0 ? (
                  <div className="bg-stone-50 dark:bg-stone-800/50 rounded-xl p-2.5">
                    <p className="text-lg font-bold text-stone-900 dark:text-stone-50">{totalHeight}m</p>
                    <p className="text-[10px] text-stone-400">vertical</p>
                  </div>
                ) : (
                  <div className="bg-stone-50 dark:bg-stone-800/50 rounded-xl p-2.5">
                    <p className="text-xs font-bold text-stone-900 dark:text-stone-50 capitalize">{bestStyle}</p>
                    <p className="text-[10px] text-stone-400">best style</p>
                  </div>
                )}
              </div>
              <div className="mt-3 space-y-1">
                {sessionLog.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-semibold capitalize', ASCENT_COLORS[r.ascentType] || 'bg-stone-200')}>
                      {r.ascentType.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="text-stone-700 dark:text-stone-300 truncate flex-1">{r.routeName}</span>
                    <span className="text-stone-400 shrink-0">{r.grade}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        <div className="flex gap-3 w-full max-w-sm">
          <button onClick={reset} className="btn-primary flex-1">
            <RotateCcw className="w-4 h-4" /> Log another
          </button>
          <button onClick={resetFull} className="btn-secondary flex-1">
            New crag
          </button>
        </div>

        {sessionCrag && sessionLog.length < 2 && (
          <p className="text-xs text-stone-400 flex items-center gap-1">
            <Zap className="w-3 h-3" /> Session active at <strong>{sessionCrag.name}</strong>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* ── Step progress ───────────────────────────────────────────── */}
      <div className="flex gap-1.5 mb-5">
        {STEPS.map((s, i) => (
          <div key={s} className={cn(
            'h-1.5 flex-1 rounded-full transition-all duration-300',
            i < stepIdx ? 'bg-rock-600' : i === stepIdx ? 'bg-rock-400' : 'bg-stone-200 dark:bg-stone-700',
          )} />
        ))}
      </div>

      {/* ── STEP 1: Select Crag ─────────────────────────────────────── */}
      {step === 'crag' && (
        <div className="animate-slide-up space-y-4">
          <div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-50">Where did you climb?</h2>
            <p className="text-sm text-stone-500 mt-0.5">
              {lat ? '📍 Showing nearest crags' : 'Search by name or enable GPS'}
            </p>
          </div>

          {/* Session banner */}
          {sessionCrag && (
            <div
              className="card p-3.5 border-rock-300 dark:border-rock-700 bg-rock-50 dark:bg-rock-900/20 flex items-center gap-3 cursor-pointer hover:border-rock-400 transition-colors"
              onClick={() => selectCrag(sessionCrag)}
            >
              <div className="w-8 h-8 bg-rock-600 rounded-xl flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-rock-600 dark:text-rock-400 uppercase tracking-wide">Active session</p>
                <p className="font-bold text-stone-900 dark:text-stone-100 truncate">{sessionCrag.name}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-rock-400 shrink-0" />
            </div>
          )}

          {/* Search mode toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => { setShowGlobalSearch(false); setGlobalRouteSearch(''); }}
              className={cn('flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all',
                !showGlobalSearch ? 'border-rock-600 bg-rock-50 dark:bg-rock-900/20 text-rock-700 dark:text-rock-400' : 'border-stone-200 dark:border-stone-700 text-stone-500')}
            >
              By crag
            </button>
            <button
              onClick={() => { setShowGlobalSearch(true); setCragSearch(''); }}
              className={cn('flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all',
                showGlobalSearch ? 'border-rock-600 bg-rock-50 dark:bg-rock-900/20 text-rock-700 dark:text-rock-400' : 'border-stone-200 dark:border-stone-700 text-stone-500')}
            >
              By route name
            </button>
          </div>

          {/* Global route search */}
          {showGlobalSearch ? (
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  autoFocus
                  type="text" value={globalRouteSearch}
                  onChange={(e) => setGlobalRouteSearch(e.target.value)}
                  className="input pl-10"
                  placeholder="Route name, e.g. Cenotaph Corner…"
                />
                {globalRouteSearch && (
                  <button onClick={() => setGlobalRouteSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="w-4 h-4 text-stone-400" />
                  </button>
                )}
              </div>
              {globalSearchLoading && (
                <div className="flex items-center gap-2 text-sm text-stone-400 py-3 justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" /> Searching…
                </div>
              )}
              {!globalSearchLoading && globalRouteSearch.length >= 2 && (globalRouteResults as Route[]).length === 0 && (
                <p className="text-sm text-stone-400 text-center py-3">No routes found. Try a different name.</p>
              )}
              <div className="space-y-1.5">
                {(globalRouteResults as Route[]).slice(0, 15).map((route) => (
                  <button
                    key={route.id}
                    onClick={() => selectGlobalRoute(route)}
                    className="card-hover w-full p-3.5 flex items-center gap-3 text-left"
                  >
                    <GradeChip grade={route.grade} gradeSystem={route.gradeSystem} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-stone-900 dark:text-stone-100 text-sm truncate">{route.name}</p>
                      <p className="text-xs text-stone-400 truncate">
                        {route.buttress?.crag?.name || ''}
                        {route.buttress?.name ? ` · ${route.buttress.name}` : ''}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-300 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
          <>
          {/* Crag search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text" value={cragSearch}
              onChange={(e) => setCragSearch(e.target.value)}
              className="input pl-10"
              placeholder="Search crags…"
            />
          </div>

          {gpsError && (
            <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-3 py-2.5">
              <Navigation className="w-3.5 h-3.5 shrink-0" />
              <span className="flex-1">{gpsError}</span>
              <button onClick={refreshGps} className="underline font-semibold">Retry</button>
            </div>
          )}

          {/* Favourites */}
          {favCrags.length > 0 && !cragSearch && (
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Heart className="w-3 h-3" /> Favourites
              </p>
              <div className="space-y-1.5">
                {favCrags.slice(0, 3).map((crag) => (
                  <CragRow key={crag.id} crag={crag} onSelect={selectCrag}
                    isFav={true}
                    onToggleFav={() => { toggleFavouriteCrag(crag); setFavCrags(getFavouriteCrags()); }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recents */}
          {recentCrags.length > 0 && !cragSearch && (
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> Recent
              </p>
              <div className="space-y-1.5">
                {recentCrags.slice(0, 3).map((crag) => (
                  <CragRow key={crag.id} crag={crag} onSelect={selectCrag}
                    isFav={isFavouriteCrag(crag.id)}
                    onToggleFav={() => { toggleFavouriteCrag(crag); setFavCrags(getFavouriteCrags()); }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* GPS / search results */}
          {(cragSearch || lat) && (
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <MapPin className="w-3 h-3" /> {lat && !cragSearch ? 'Nearby crags' : 'Search results'}
              </p>
              <div className="space-y-1.5">
                {(cragsLoading || gpsLoading) && (
                  <div className="flex items-center gap-2 text-sm text-stone-400 py-4 justify-center">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {gpsLoading ? 'Getting location…' : 'Searching…'}
                  </div>
                )}
                {(cragData?.crags || []).map((crag: Crag) => (
                  <CragRow key={crag.id} crag={crag} onSelect={selectCrag}
                    isFav={isFavouriteCrag(crag.id)}
                    onToggleFav={() => { toggleFavouriteCrag(crag); setFavCrags(getFavouriteCrags()); }}
                  />
                ))}
              </div>
            </div>
          )}
          </>
          )}
        </div>
      )}

      {/* ── STEP 2: Select Buttress ─────────────────────────────────── */}
      {step === 'buttress' && (
        <div className="animate-slide-up">
          <button onClick={() => setStep('crag')} className="btn-ghost mb-3 text-stone-500 px-0 text-sm">
            ← {selectedCrag?.name}
          </button>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-50 mb-4">Which buttress?</h2>
          <div className="space-y-2">
            {buttressLoading && (
              <div className="flex items-center gap-2 text-sm text-stone-400 py-4 justify-center">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading…
              </div>
            )}
            {(buttresses as Buttress[]).map((b) => (
              <button key={b.id}
                onClick={() => { setSelectedButtress(b); setStep('route'); }}
                className="card-hover w-full p-4 flex items-center gap-3 text-left"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-stone-900 dark:text-stone-100">{b.name}</p>
                  {b.routes && (
                    <p className="text-xs text-stone-400 mt-0.5">{b.routes.length} route{b.routes.length !== 1 ? 's' : ''}</p>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-stone-300 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── STEP 3: Select Route ────────────────────────────────────── */}
      {step === 'route' && (
        <div className="animate-slide-up">
          <button onClick={() => setStep('buttress')} className="btn-ghost mb-3 text-stone-500 px-0 text-sm">
            ← {selectedButtress?.name}
          </button>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-50 mb-3">Which route?</h2>

          {/* Filters */}
          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
              <input value={routeSearch} onChange={(e) => setRouteSearch(e.target.value)}
                className="input pl-9 h-10 text-sm" placeholder="Filter routes…" />
            </div>
            <select value={climbTypeFilter}
              onChange={(e) => setClimbTypeFilter(e.target.value as ClimbingType | '')}
              className="input h-10 text-sm w-28 px-3">
              <option value="">All</option>
              <option value="trad">🪢 Trad</option>
              <option value="sport">🔩 Sport</option>
              <option value="boulder">🪨 Boulder</option>
            </select>
          </div>

          {/* "Not listed?" escape hatch */}
          {!showFreeForm && (
            <button onClick={() => { setShowFreeForm(true); setStep('style'); }}
              className="w-full mb-3 border-2 border-dashed border-stone-200 dark:border-stone-700 rounded-2xl p-3.5 text-sm text-stone-500 dark:text-stone-400 hover:border-rock-300 hover:text-rock-600 transition-colors flex items-center justify-center gap-2">
              <PlusCircle className="w-4 h-4" />
              Route not listed? Add it manually
            </button>
          )}

          <div className="space-y-2">
            {filteredRoutes.length === 0 && !cragsLoading && (
              <p className="text-center text-stone-400 text-sm py-4">No routes match your filters.</p>
            )}
            {filteredRoutes.map((r: Route) => (
              <button key={r.id}
                onClick={() => { setSelectedRoute(r); setStep('style'); }}
                className="card-hover w-full p-4 flex items-center gap-3 text-left"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-stone-900 dark:text-stone-100">{r.name}</p>
                  <p className="text-xs text-stone-400 mt-0.5 capitalize">
                    {CLIMB_TYPE_ICONS[r.climbingType] || ''} {r.climbingType}
                    {r.pitches && r.pitches > 1 ? ` · ${r.pitches}p` : ''}
                    {r.heightMetres ? ` · ${r.heightMetres}m` : ''}
                  </p>
                  {r.description && (
                    <p className="text-xs text-stone-400 mt-1 line-clamp-1">{r.description}</p>
                  )}
                </div>
                <GradeChip grade={r.grade} gradeSystem={r.gradeSystem} className="shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── STEP 4: Ascent details ──────────────────────────────────── */}
      {step === 'style' && (
        <div className="animate-slide-up">
          <button onClick={() => { setShowFreeForm(false); setStep('route'); }}
            className="btn-ghost mb-3 text-stone-500 px-0 text-sm">
            ← {showFreeForm ? 'Back' : selectedRoute?.name}
          </button>

          {/* Free-text form */}
          {showFreeForm ? (
            <div className="card p-4 mb-5 space-y-3 border-rock-200 dark:border-rock-700">
              <p className="text-sm font-bold text-rock-600 dark:text-rock-400 flex items-center gap-2">
                <PlusCircle className="w-4 h-4" /> Route details
              </p>
              <div>
                <label className="label">Route name</label>
                <input value={freeRouteName} onChange={(e) => setFreeRouteName(e.target.value)}
                  className="input" placeholder="e.g. Cenotaph Corner" />
              </div>
              <div>
                <label className="label">Grade</label>
                <input value={freeGrade} onChange={(e) => setFreeGrade(e.target.value)}
                  className="input" placeholder="e.g. VS, 6c+" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-5 card p-3.5">
              <GradeChip grade={selectedRoute!.grade} gradeSystem={selectedRoute!.gradeSystem} />
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-stone-900 dark:text-stone-100 leading-tight">{selectedRoute?.name}</h2>
                <p className="text-xs text-stone-400 capitalize mt-0.5">
                  {selectedCrag?.name}
                  {selectedRoute?.heightMetres ? ` · ${selectedRoute.heightMetres}m` : ''}
                  {selectedRoute?.pitches && selectedRoute.pitches > 1 ? ` · ${selectedRoute.pitches} pitches` : ''}
                </p>
              </div>
            </div>
          )}

          {/* Ascent type */}
          <p className="label mb-2">How did you climb it?</p>
          <div className="flex gap-2 flex-wrap mb-5">
            {ASCENT_TYPES.map((t) => (
              <button key={t} onClick={() => setAscentType(t)}
                className={cn(
                  'px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-100 active:scale-95',
                  ascentType === t
                    ? ASCENT_COLORS[t] || 'bg-rock-600 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700',
                )}>
                {ASCENT_TYPE_LABELS[t]}
              </button>
            ))}
          </div>

          {/* Date */}
          <div className="mb-4">
            <label className="label">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="input" max={today()} />
          </div>

          {/* Star rating */}
          <div className="mb-4">
            <label className="label">Route quality</label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setStarRating(s === starRating ? 0 : s)} className="p-1">
                  <Star className={cn('w-7 h-7 transition-colors', s <= starRating ? 'fill-amber-400 text-amber-400' : 'text-stone-200')} />
                </button>
              ))}
            </div>
          </div>

          {/* Partner */}
          <div className="mb-4">
            <label className="label">Partner (optional)</label>
            <input type="text" value={partner} onChange={(e) => setPartner(e.target.value)}
              className="input" placeholder="Climbing partner" />
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="label">Notes (optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
              className="input resize-none" rows={2}
              placeholder="Beta, conditions, feelings…" />
          </div>

          <button onClick={handleSubmit}
            disabled={logMutation.isPending || (showFreeForm && !freeRouteName) || (!showFreeForm && !selectedRoute)}
            className="btn-primary w-full text-base">
            {logMutation.isPending
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
              : <><Check className="w-5 h-5" /> Log climb</>}
          </button>

          {logMutation.error && (
            <p className="text-red-500 text-sm text-center mt-3">
              {(logMutation.error as any)?.response?.data?.message || 'Failed to save. Try again.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Crag row component ────────────────────────────────────────────────────────

function CragRow({ crag, onSelect, isFav, onToggleFav }: {
  crag: Crag;
  onSelect: (c: Crag) => void;
  isFav: boolean;
  onToggleFav: () => void;
}) {
  return (
    <div className="card flex items-center gap-0 overflow-hidden hover:border-rock-300 hover:shadow transition-all">
      <button onClick={() => onSelect(crag)} className="flex-1 p-3.5 flex items-center gap-3 text-left min-h-0">
        <MapPin className="w-4 h-4 text-rock-400 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-stone-900 dark:text-stone-100 text-sm">{crag.name}</p>
          <p className="text-xs text-stone-400 truncate">
            {crag.distanceMetres != null ? `${(crag.distanceMetres / 1000).toFixed(1)}km · ` : ''}
            {(crag as any).regionName || crag.region?.name || crag.rockType}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-stone-300 shrink-0" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onToggleFav(); }}
        className="w-11 h-full flex items-center justify-center border-l border-stone-100 dark:border-stone-800 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
        <Heart className={cn('w-4 h-4 transition-colors', isFav ? 'fill-red-500 text-red-500' : 'text-stone-300')} />
      </button>
    </div>
  );
}

export default function LogPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-rock-400" /></div>}>
      <LogPageInner />
    </Suspense>
  );
}
