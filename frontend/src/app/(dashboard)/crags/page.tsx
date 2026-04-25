'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cragsApi } from '@/lib/api';
import { useGeolocation } from '@/hooks/useGeolocation';
import { formatDistance } from '@/lib/utils';
import type { Crag } from '@/types';
import { Search, MapPin, Navigation, Loader2, ChevronRight, Mountain } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const CragMap = dynamic(() => import('@/components/CragMap/CragMap'), {
  ssr: false,
  loading: () => <div className="h-56 bg-stone-100 rounded-2xl animate-pulse" />,
});

export default function CragsPage() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Crag | null>(null);
  const { lat, lng, loading: gpsLoading, refresh } = useGeolocation(false);

  const { data, isLoading } = useQuery({
    queryKey: ['crags-search', query, lat, lng],
    queryFn: () =>
      cragsApi.search(
        lat && !query
          ? { lat, lng, radiusKm: 100, limit: 20 }
          : { q: query || undefined, limit: 30 },
      ),
    staleTime: 30000,
  });

  const crags: Crag[] = data?.crags || [];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-stone-900">Crags</h1>

      {/* Search */}
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

      {/* Map */}
      <div className="h-56">
        <CragMap
          crags={crags}
          userLat={lat}
          userLng={lng}
          selectedCragId={selected?.id}
          onCragClick={setSelected}
        />
      </div>

      {/* Crag list */}
      <div className="space-y-2">
        {isLoading && (
          <div className="flex items-center justify-center py-8 text-stone-400">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading crags…
          </div>
        )}
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
