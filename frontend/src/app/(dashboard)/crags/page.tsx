'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cragsApi } from '@/lib/api';
import { useGeolocation } from '@/hooks/useGeolocation';
import { formatDistance } from '@/lib/utils';
import type { Crag } from '@/types';
import { Search, MapPin, Navigation, Loader2, ChevronRight, Mountain, ChevronDown, Map, List } from 'lucide-react';
import { SkeletonList } from '@/components/Skeleton';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const CragMap = dynamic(() => import('@/components/CragMap/CragMap'), {
  ssr: false,
  loading: () => <div className="bg-stone-100 dark:bg-stone-800 rounded-2xl animate-pulse w-full h-full" />,
});

const CLIMBING_TYPES = [
  { value: '', label: 'All' },
  { value: 'trad', label: 'Trad' },
  { value: 'sport', label: 'Sport' },
  { value: 'boulder', label: 'Boulder' },
  { value: 'mixed', label: 'Mixed' },
  { value: 'alpine', label: 'Alpine' },
  { value: 'dws', label: 'DWS' },
];

const COUNTRIES = [
  { value: '', label: 'All UK' },
  { value: 'England', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England' },
  { value: 'Wales', label: '🏴󠁧󠁢󠁷󠁬󠁳󠁿 Wales' },
  { value: 'Scotland', label: '🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scotland' },
];

export default function CragsPage() {
  const [query, setQuery] = useState('');
  const [climbingType, setClimbingType] = useState('');
  const [country, setCountry] = useState('');
  const [regionId, setRegionId] = useState('');
  const [selected, setSelected] = useState<Crag | null>(null);
  const [view, setView] = useState<'list' | 'map'>('list');
  const { lat, lng, loading: gpsLoading, refresh } = useGeolocation(false);

  const { data: regionsData } = useQuery({
    queryKey: ['regions'],
    queryFn: () => cragsApi.getRegions(),
    staleTime: 300000,
  });

  const allRegions: { id: string; name: string; country: string }[] = regionsData || [];
  const filteredRegions = country
    ? allRegions.filter((r) => r.country === country)
    : allRegions;

  const { data: mapPinsData } = useQuery({
    queryKey: ['map-pins'],
    queryFn: () => cragsApi.getMapPins(),
    staleTime: 600000,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['crags-search', query, lat, lng, climbingType, country, regionId],
    queryFn: () =>
      cragsApi.search(
        lat && !query
          ? { lat, lng, radiusKm: 100, limit: 50, climbingType: climbingType || undefined, country: country || undefined, regionId: regionId || undefined }
          : { q: query || undefined, limit: 50, climbingType: climbingType || undefined, country: country || undefined, regionId: regionId || undefined },
      ),
    staleTime: 30000,
  });

  const crags: Crag[] = data?.crags || [];

  function handleCountryChange(v: string) {
    setCountry(v);
    setRegionId('');
  }

  const hasFilters = !!(climbingType || country || regionId || query);

  return (
    <div className="space-y-3">

      {/* ── Title + view toggle ───────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50">Explore</h1>
        <div className="flex bg-stone-100 dark:bg-stone-800 rounded-xl p-1 gap-1">
          <button
            onClick={() => setView('list')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all',
              view === 'list'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-50 shadow-sm'
                : 'text-stone-400 dark:text-stone-500',
            )}
          >
            <List className="w-3.5 h-3.5" />
            List
          </button>
          <button
            onClick={() => setView('map')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all',
              view === 'map'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-50 shadow-sm'
                : 'text-stone-400 dark:text-stone-500',
            )}
          >
            <Map className="w-3.5 h-3.5" />
            Map
          </button>
        </div>
      </div>

      {/* ── Search + GPS ─────────────────────────────────────────────── */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input pl-10"
            placeholder="Search crags, regions…"
          />
        </div>
        <button
          onClick={refresh}
          className={cn('btn-secondary px-3', gpsLoading && 'opacity-50')}
          title="Near me"
        >
          {gpsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
        </button>
      </div>

      {/* ── MAP VIEW ─────────────────────────────────────────────────── */}
      {view === 'map' && (
        <>
          {/* Big map */}
          <div className="rounded-2xl overflow-hidden shadow-sm border border-stone-200 dark:border-stone-700" style={{ height: '45vh', minHeight: 280 }}>
            <CragMap
              crags={crags}
              allCrags={mapPinsData}
              userLat={lat}
              userLng={lng}
              selectedCragId={selected?.id}
              onCragClick={setSelected}
              height="100%"
            />
          </div>

          {/* Type chips */}
          <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
            {CLIMBING_TYPES.map((ct) => (
              <button
                key={ct.value}
                onClick={() => setClimbingType(ct.value)}
                className={cn(
                  'shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
                  climbingType === ct.value
                    ? 'bg-rock-600 border-rock-600 text-white'
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300',
                )}
              >
                {ct.label}
              </button>
            ))}
          </div>

          {/* Compact crag list below map */}
          {!isLoading && crags.length > 0 && (
            <p className="text-xs text-stone-400">{crags.length} crags</p>
          )}
          <div className="space-y-2">
            {isLoading && <SkeletonList count={4} />}
            {crags.map((crag) => (
              <Link
                key={crag.id}
                href={`/crags/${crag.id}`}
                onClick={() => setSelected(crag)}
                className={cn(
                  'card w-full p-3 text-left flex items-center gap-3 transition-all active:scale-[0.99] block',
                  selected?.id === crag.id && 'border-rock-400 shadow-md',
                )}
              >
                <MapPin className={cn('w-4 h-4 shrink-0', selected?.id === crag.id ? 'text-rock-500' : 'text-stone-300')} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-stone-900 dark:text-stone-50 truncate">{crag.name}</p>
                  <p className="text-xs text-stone-400 capitalize">
                    {(crag as any).regionName || crag.region?.name || '—'}
                    {crag.distanceMetres != null && ` · ${formatDistance(crag.distanceMetres)}`}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-300 shrink-0" />
              </Link>
            ))}
          </div>
        </>
      )}

      {/* ── LIST VIEW ────────────────────────────────────────────────── */}
      {view === 'list' && (
        <>
          {/* Country tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            {COUNTRIES.map((c) => (
              <button
                key={c.value}
                onClick={() => handleCountryChange(c.value)}
                className={cn(
                  'shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
                  country === c.value
                    ? 'bg-summit-600 border-summit-600 text-white'
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300',
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Climbing type chips */}
          <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
            {CLIMBING_TYPES.map((ct) => (
              <button
                key={ct.value}
                onClick={() => setClimbingType(ct.value)}
                className={cn(
                  'shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
                  climbingType === ct.value
                    ? 'bg-rock-600 border-rock-600 text-white'
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300',
                )}
              >
                {ct.label}
              </button>
            ))}
          </div>

          {/* Region dropdown */}
          {filteredRegions.length > 0 && (
            <div className="relative">
              <select
                value={regionId}
                onChange={(e) => setRegionId(e.target.value)}
                className="w-full appearance-none input pr-8 text-sm"
              >
                <option value="">All regions{country ? ` in ${country}` : ''}</option>
                {filteredRegions
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
            </div>
          )}

          {/* Active filter summary */}
          {hasFilters && !isLoading && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-stone-400">{crags.length} crags</p>
              <button
                onClick={() => { setQuery(''); setClimbingType(''); setCountry(''); setRegionId(''); }}
                className="text-xs text-rock-500 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
          {!hasFilters && !isLoading && crags.length > 0 && (
            <p className="text-xs text-stone-400">{crags.length} crags</p>
          )}

          {/* Crag list */}
          <div className="space-y-2">
            {isLoading && <SkeletonList count={6} />}
            {!isLoading && crags.length === 0 && (
              <div className="card p-8 text-center">
                <Mountain className="w-10 h-10 text-stone-200 mx-auto mb-3" />
                <p className="text-stone-500 text-sm">No crags found. Try a different search.</p>
              </div>
            )}
            {crags.map((crag) => (
              <Link
                key={crag.id}
                href={`/crags/${crag.id}`}
                onClick={() => setSelected(crag)}
                className="card w-full p-4 text-left transition-all hover:shadow hover:border-rock-300 dark:hover:border-rock-700 active:scale-[0.99] block"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 shrink-0 text-stone-300" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-stone-900 dark:text-stone-50">{crag.name}</p>
                    <p className="text-xs text-stone-400 mt-0.5 capitalize">
                      {(crag as any).regionName || crag.region?.name || '—'} · {crag.rockType}
                      {crag.distanceMetres != null && ` · ${formatDistance(crag.distanceMetres)}`}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-300 shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

    </div>
  );
}
