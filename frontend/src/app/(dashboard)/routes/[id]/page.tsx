'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft, Mountain, Target, Star, Calendar, User2,
  Plus, Check, ChevronRight, BookOpen, RotateCcw,
} from 'lucide-react';
import { routesApi, ascentsApi } from '@/lib/api';
import { GradeChip } from '@/components/GradeChip';
import { EmptyState } from '@/components/EmptyState';
import { addProject, getProjects, removeProject } from '@/lib/projectsStore';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Ascent, AscentType } from '@/types';
import { ASCENT_TYPE_LABELS } from '@/types';

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3].map((n) => (
        <Star
          key={n}
          className={cn('w-3.5 h-3.5', n <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200')}
        />
      ))}
    </div>
  );
}

export default function RouteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const [projectAdded, setProjectAdded] = useState(false);

  const { data: route, isLoading: routeLoading } = useQuery({
    queryKey: ['route', id],
    queryFn: () => routesApi.getById(id),
    enabled: !!id,
  });

  const { data: ascentsData } = useQuery({
    queryKey: ['ascents-by-route', id],
    queryFn: () => ascentsApi.list({ routeId: id }),
    enabled: !!id,
  });

  const ascents: Ascent[] = ascentsData?.ascents || [];

  const isOnProject = getProjects().some((p) => p.routeId === id);

  const toggleProject = () => {
    if (isOnProject) {
      const p = getProjects().find((p) => p.routeId === id);
      if (p) removeProject(p.id);
      setProjectAdded(false);
    } else {
      addProject({
        routeId: id,
        routeName: route?.name || 'Unknown',
        grade: route?.grade || '',
        gradeSystem: route?.gradeSystem || 'uk_trad',
        cragName: route?.buttress?.crag?.name || '',
        cragId: route?.buttress?.crag?.id,
        notes: '',
        priority: 'medium',
      });
      setProjectAdded(true);
    }
  };

  if (routeLoading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="skeleton h-8 w-2/3 rounded-xl" />
        <div className="skeleton h-32 rounded-2xl" />
        <div className="skeleton h-48 rounded-2xl" />
      </div>
    );
  }

  if (!route) {
    return (
      <EmptyState
        icon={<Mountain className="w-8 h-8" />}
        title="Route not found"
        body="This route may have been removed or the link is incorrect."
        cta="Go back"
        ctaOnClick={() => router.back()}
      />
    );
  }

  const onProject = isOnProject || projectAdded;
  const totalAscents = ascents.length;
  const onsights  = ascents.filter((a) => a.ascentType === 'onsight').length;
  const topStyle: AscentType | null = ['onsight','flash','redpoint','pinkpoint','repeat'].find((s) =>
    ascents.some((a) => a.ascentType === s)
  ) as AscentType | null;

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── Back button ───────────────────────────────────────────────── */}
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-stone-500 -mb-1">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* ── Route hero card ───────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-rock-600 to-rock-800 rounded-3xl p-5 text-white">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold leading-tight">{route.name}</h1>
            {route.buttress?.crag?.name && (
              <p className="text-sm text-white/70 mt-0.5 flex items-center gap-1">
                <Mountain className="w-3 h-3" />
                {route.buttress.crag.name}
                {route.buttress.name && ` · ${route.buttress.name}`}
              </p>
            )}
          </div>
          <GradeChip grade={route.grade} gradeSystem={route.gradeSystem} size="md" />
        </div>

        {/* meta row */}
        <div className="flex flex-wrap gap-3 mt-4 text-sm text-white/80">
          {route.climbingType && (
            <span className="bg-white/15 px-2.5 py-1 rounded-lg capitalize text-xs font-medium">
              {route.climbingType}
            </span>
          )}
          {route.pitches && route.pitches > 1 && (
            <span className="bg-white/15 px-2.5 py-1 rounded-lg text-xs font-medium">
              {route.pitches} pitches
            </span>
          )}
          {route.heightMetres && (
            <span className="bg-white/15 px-2.5 py-1 rounded-lg text-xs font-medium">
              {route.heightMetres}m
            </span>
          )}
        </div>

        {route.description && (
          <p className="text-sm text-white/80 mt-3 leading-relaxed line-clamp-3">{route.description}</p>
        )}
      </div>

      {/* ── Actions ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => router.push(`/log?routeId=${id}&cragId=${route.buttress?.crag?.id || ''}`)}
          className="btn-primary py-3"
        >
          <Plus className="w-4 h-4" /> Log ascent
        </button>
        <button
          onClick={toggleProject}
          className={cn(
            'flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm border-2 transition-all',
            onProject
              ? 'bg-rock-50 dark:bg-rock-900/20 border-rock-600 text-rock-700 dark:text-rock-400'
              : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-rock-400',
          )}
        >
          {onProject ? <Check className="w-4 h-4" /> : <Target className="w-4 h-4" />}
          {onProject ? 'On project list' : 'Add to projects'}
        </button>
      </div>

      {/* ── Your stats ────────────────────────────────────────────────── */}
      {totalAscents > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-stone-500 dark:text-stone-400 mb-2">Your history</h2>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { label: 'Ascents', value: totalAscents },
              { label: 'Onsights', value: onsights },
              { label: 'Best style', value: topStyle ? ASCENT_TYPE_LABELS[topStyle] : '—' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-3 text-center">
                <p className="text-lg font-bold text-stone-900 dark:text-stone-50">{value}</p>
                <p className="text-[10px] text-stone-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {ascents.slice(0, 10).map((a) => (
              <div key={a.id} className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-3.5 flex items-center gap-3">
                <div className={cn('text-[10px] px-2 py-1 rounded-lg font-bold capitalize shrink-0', `ascent-${a.ascentType}`)}>
                  {ASCENT_TYPE_LABELS[a.ascentType]?.split('/')[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-stone-600 dark:text-stone-300">{formatDate(a.date)}</p>
                  {a.notes && (
                    <p className="text-xs text-stone-400 truncate mt-0.5">{a.notes}</p>
                  )}
                </div>
                {a.starRating && a.starRating > 0 && <StarRow rating={a.starRating} />}
              </div>
            ))}
          </div>
        </div>
      )}

      {totalAscents === 0 && (
        <EmptyState
          icon={<BookOpen className="w-7 h-7" />}
          title="Not climbed yet"
          body="Log your first ascent of this route."
          cta="Log now"
          ctaOnClick={() => router.push(`/log?routeId=${id}&cragId=${route.buttress?.crag?.id || ''}`)}
        />
      )}

      {/* ── Protection / approach ─────────────────────────────────────── */}
      {(route.protection || route.technicalGrade) && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-4 space-y-3">
          {route.technicalGrade && (
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-0.5">Technical grade</p>
              <p className="text-sm text-stone-700 dark:text-stone-300">{route.technicalGrade}</p>
            </div>
          )}
          {route.protection && (
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-0.5">Protection</p>
              <p className="text-sm text-stone-700 dark:text-stone-300">{route.protection}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
