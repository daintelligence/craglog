'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cragsApi } from '@/lib/api';
import { useGeolocation } from '@/hooks/useGeolocation';
import { formatDistance } from '@/lib/utils';
import type { Crag } from '@/types';
import { Search, MapPin, Navigation, Loader2, ChevronRight, Mountain, ChevronDown } from 'lucide-react';
import { SkeletonList } from '@/components/Skeleton';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const CragMap = dynamic(() => import('@/components/CragMap/CragMap'), {
  ssr: false,
  loading: () => <div className="h-[360px] bg-stone-100 rounded-2xl animate-pulse" />,
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
  { value: 'England', label: 'England' },
  { value: 'Wales', label: 'Wales' },
  { value: 'Scotland', label: 'Scotland' },
];

export default function CragsPage() {
  const [query, setQuery] = useState('');
  const [climbingType, setClimbingType] = useState('');
  const [country, setCountry] = useState('');
  const [regionId, setRegionId] = useState('');
  const [selected, setSelected] = useState<Crag | null>(null);
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
    setRegionId(''); // reset region when country changes
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-stone-900">Crags</h1>

      {/* Search + GPS */}
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
          title="Use my location"
        >
          {gpsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
        </button>
      </div>

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
                : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-summit-400',
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Region dropdown (shown when regions are available) */}
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
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
        </div>
      )}

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
                : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-rock-400',
            )}
          >
            {ct.label}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="h-[360px]">
        <CragMap
          crags={crags}
          userLat={lat}
          userLng={lng}
          selectedCragId={selected?.id}
          onCragClick={setSelected}
          height="360px"
        />
      </div>

      {/* Result count */}
      {!isLoading && crags.length > 0 && (
        <p className="text-xs text-stone-400 px-0.5">{crags.length} crags</p>
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
            className={cn(
              'card w-full p-4 text-left transition-all hover:shadow hover:border-rock-300 dark:hover:border-rock-700 active:scale-[0.99] block',
              selected?.id === crag.id && 'border-rock-400 shadow-md',
            )}
          >
            <div className="flex items-center gap-3">
              <MapPin className={cn('w-5 h-5 shrink-0', selected?.id === crag.id ? 'text-rock-500' : 'text-stone-300')} />
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
    </div>
  );
}
