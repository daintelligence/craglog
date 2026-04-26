'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, Mountain, MapPin, PlusCircle, Target, ChevronDown,
  ChevronUp, Car, Footprints, Info, Cloud, Wind, Droplets, Users,
} from 'lucide-react';
import Link from 'next/link';
import { cragsApi, projectsApi } from '@/lib/api';
import { GradeChip } from '@/components/GradeChip';
import { EmptyState } from '@/components/EmptyState';
import { cn } from '@/lib/utils';
import type { Buttress, Route } from '@/types';

const ROCK_GRADIENTS: Record<string, string> = {
  gritstone:  'from-amber-700 to-amber-900',
  limestone:  'from-slate-600 to-slate-800',
  granite:    'from-stone-600 to-stone-800',
  sandstone:  'from-orange-700 to-red-800',
  basalt:     'from-stone-700 to-stone-900',
  quartzite:  'from-cyan-700 to-teal-800',
  other:      'from-rock-600 to-rock-800',
};

// Open-Meteo WMO code → label + condition class
function weatherLabel(code: number): { label: string; condition: 'dry' | 'damp' | 'wet' } {
  if (code === 0) return { label: 'Clear sky', condition: 'dry' };
  if (code <= 2)  return { label: 'Partly cloudy', condition: 'dry' };
  if (code === 3) return { label: 'Overcast', condition: 'dry' };
  if (code <= 49) return { label: 'Fog', condition: 'damp' };
  if (code <= 57) return { label: 'Drizzle', condition: 'damp' };
  if (code <= 67) return { label: 'Rain', condition: 'wet' };
  if (code <= 77) return { label: 'Snow', condition: 'wet' };
  if (code <= 82) return { label: 'Rain showers', condition: 'wet' };
  if (code <= 99) return { label: 'Thunderstorm', condition: 'wet' };
  return { label: 'Unknown', condition: 'dry' };
}

const CONDITION_CLASS: Record<'dry' | 'damp' | 'wet', string> = {
  dry:  'bg-summit-100 text-summit-700 dark:bg-summit-900/30 dark:text-summit-400',
  damp: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  wet:  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

function WeatherWidget({ lat, lng }: { lat: number; lng: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ['weather', lat, lng],
    queryFn: () =>
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,wind_speed_10m,precipitation&timezone=auto`,
      ).then((r) => r.json()),
    staleTime: 15 * 60 * 1000,
  });

  if (isLoading) return <div className="skeleton h-16 rounded-2xl" />;
  if (!data?.current) return null;

  const { temperature_2m, weather_code, wind_speed_10m, precipitation } = data.current;
  const { label, condition } = weatherLabel(weather_code);

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cloud className="w-4 h-4 text-stone-400" />
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Conditions now</span>
        </div>
        <span className={cn('text-xs font-bold px-2.5 py-1 rounded-full capitalize', CONDITION_CLASS[condition])}>
          {condition}
        </span>
      </div>
      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-stone-900 dark:text-stone-50">{Math.round(temperature_2m)}°</span>
          <span className="text-xs text-stone-400">C</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-stone-500">
          <Wind className="w-3.5 h-3.5" />
          {Math.round(wind_speed_10m)} km/h
        </div>
        {precipitation > 0 && (
          <div className="flex items-center gap-1 text-xs text-blue-500">
            <Droplets className="w-3.5 h-3.5" />
            {precipitation}mm
          </div>
        )}
        <span className="text-xs text-stone-400 flex-1 text-right">{label}</span>
      </div>
    </div>
  );
}

function ConditionsWidget({ cragId }: { cragId: string }) {
  const { data } = useQuery({
    queryKey: ['crag-conditions', cragId],
    queryFn: () => cragsApi.getConditions(cragId),
    staleTime: 5 * 60 * 1000,
  });

  if (!data || data.climbers === 0) return null;

  const topCondition = data.conditionCounts?.[0]?.condition;

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Users className="w-4 h-4 text-stone-400" />
        <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Community — last 7 days</span>
      </div>
      <p className="text-sm text-stone-700 dark:text-stone-300">
        <span className="font-semibold">{data.climbers}</span>{' '}
        {data.climbers === 1 ? 'climber' : 'climbers'},{' '}
        <span className="font-semibold">{data.ascents}</span> ascents
        {topCondition && (
          <> · <span className="text-stone-500">mostly {topCondition}</span></>
        )}
      </p>
    </div>
  );
}

function RouteRow({ route, cragId }: { route: Route; cragId: string }) {
  const qc = useQueryClient();
  const { data: projects } = useQuery({ queryKey: ['projects'], queryFn: projectsApi.list });
  const onProject = projects?.some((p: any) => p.routeId === route.id) ?? false;

  const addMut = useMutation({
    mutationFn: () => projectsApi.add({ routeId: route.id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
  const removeMut = useMutation({
    mutationFn: () => {
      const p = projects?.find((p: any) => p.routeId === route.id);
      return p ? projectsApi.remove(p.id) : Promise.resolve() as any;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onProject) removeMut.mutate();
    else addMut.mutate();
  };

  return (
    <div className="flex items-center gap-2 py-2.5 border-b border-stone-50 dark:border-stone-800 last:border-0">
      <GradeChip grade={route.grade} gradeSystem={route.gradeSystem} size="sm" />
      <div className="flex-1 min-w-0">
        <Link
          href={`/routes/${route.id}`}
          className="text-sm font-semibold text-stone-900 dark:text-stone-50 hover:text-rock-600 truncate block"
        >
          {route.name}
        </Link>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-stone-400 capitalize">{route.climbingType}</span>
          {route.pitches && route.pitches > 1 && (
            <span className="text-[10px] text-stone-400">{route.pitches}p</span>
          )}
          {route.heightMetres && (
            <span className="text-[10px] text-stone-400">{route.heightMetres}m</span>
          )}
        </div>
      </div>
      <button
        onClick={toggle}
        title={onProject ? 'Remove from projects' : 'Add to projects'}
        className={cn(
          'w-7 h-7 rounded-lg flex items-center justify-center transition-all shrink-0',
          onProject
            ? 'bg-rock-100 dark:bg-rock-900/30 text-rock-600'
            : 'bg-stone-100 dark:bg-stone-800 text-stone-400 hover:text-rock-500',
        )}
      >
        <Target className="w-3.5 h-3.5" />
      </button>
      <Link
        href={`/log?routeId=${route.id}&cragId=${cragId}`}
        className="w-7 h-7 rounded-lg bg-rock-600 flex items-center justify-center shrink-0 hover:bg-rock-700 transition-colors"
        title="Log this route"
      >
        <PlusCircle className="w-3.5 h-3.5 text-white" />
      </Link>
    </div>
  );
}

function ButtressAccordion({ buttress, cragId }: { buttress: Buttress; cragId: string }) {
  const [open, setOpen] = useState(true);
  const routes: Route[] = (buttress as any).routes || [];

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-stone-900 dark:text-stone-50 text-sm">{buttress.name}</span>
          <span className="text-xs text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full">
            {routes.length}
          </span>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-stone-400 shrink-0" />
          : <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
        }
      </button>

      {open && routes.length > 0 && (
        <div className="px-4 pb-2">
          {[...routes]
            .sort((a, b) => (a.gradeDifficulty ?? 0) - (b.gradeDifficulty ?? 0))
            .map((r) => (
              <RouteRow key={r.id} route={r} cragId={cragId} />
            ))}
        </div>
      )}

      {open && routes.length === 0 && (
        <p className="px-4 pb-4 text-xs text-stone-400">No routes listed yet.</p>
      )}
    </div>
  );
}

export default function CragDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: crag, isLoading } = useQuery({
    queryKey: ['crag', id],
    queryFn: () => cragsApi.getById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="skeleton h-8 w-1/2 rounded-xl" />
        <div className="skeleton h-36 rounded-3xl" />
        <div className="skeleton h-12 rounded-2xl" />
        <div className="skeleton h-48 rounded-2xl" />
      </div>
    );
  }

  if (!crag) {
    return (
      <EmptyState
        icon={<Mountain className="w-8 h-8" />}
        title="Crag not found"
        body="This crag may have been removed or the link is incorrect."
        cta="Browse crags"
        ctaHref="/crags"
      />
    );
  }

  const buttresses: Buttress[] = crag.buttresses || [];
  const totalRoutes = buttresses.reduce((n: number, b: any) => n + (b.routes?.length || 0), 0);
  const gradient = ROCK_GRADIENTS[crag.rockType] || ROCK_GRADIENTS.other;

  const allGrades = buttresses
    .flatMap((b: any) => b.routes || [])
    .sort((a: Route, b: Route) => (a.gradeDifficulty ?? 0) - (b.gradeDifficulty ?? 0));
  const minGrade = allGrades[0]?.grade;
  const maxGrade = allGrades[allGrades.length - 1]?.grade;

  return (
    <div className="space-y-4 animate-fade-in">

      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-stone-500 -mb-1">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Hero */}
      <div className={cn('bg-gradient-to-br rounded-3xl p-5 text-white', gradient)}>
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold leading-tight">{crag.name}</h1>
            {crag.region?.name && (
              <p className="text-sm text-white/70 mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3 h-3" />
                {crag.region.name}{crag.region.country ? `, ${crag.region.country}` : ''}
              </p>
            )}
          </div>
          <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-xl capitalize shrink-0">
            {crag.rockType}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { label: 'Routes', value: totalRoutes },
            { label: 'Sectors', value: buttresses.length },
            { label: 'Grades', value: minGrade && maxGrade ? `${minGrade}–${maxGrade}` : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/15 rounded-2xl p-2.5 text-center">
              <p className="text-base font-bold">{value}</p>
              <p className="text-[10px] text-white/60">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <Link href={`/log?cragId=${crag.id}`} className="btn-primary py-3.5 w-full">
        <PlusCircle className="w-4 h-4" /> Log a climb here
      </Link>

      {/* Weather */}
      {crag.latitude && crag.longitude && (
        <WeatherWidget lat={crag.latitude} lng={crag.longitude} />
      )}

      {/* Community conditions */}
      <ConditionsWidget cragId={crag.id} />

      {/* Info panel */}
      {(crag.description || crag.approach || crag.parkingInfo) && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 divide-y divide-stone-50 dark:divide-stone-800">
          {crag.description && (
            <div className="flex gap-3 p-4">
              <Info className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">{crag.description}</p>
            </div>
          )}
          {crag.approach && (
            <div className="flex gap-3 p-4">
              <Footprints className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Approach</p>
                <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">{crag.approach}</p>
              </div>
            </div>
          )}
          {crag.parkingInfo && (
            <div className="flex gap-3 p-4">
              <Car className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Parking</p>
                <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">{crag.parkingInfo}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Buttresses */}
      {buttresses.length === 0 ? (
        <EmptyState
          icon={<Mountain className="w-7 h-7" />}
          title="No routes listed yet"
          body="Routes for this crag haven't been added yet."
        />
      ) : (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider px-1">
            Routes by sector
          </h2>
          {[...buttresses]
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
            .map((b) => (
              <ButtressAccordion key={b.id} buttress={b} cragId={crag.id} />
            ))}
        </div>
      )}
    </div>
  );
}
