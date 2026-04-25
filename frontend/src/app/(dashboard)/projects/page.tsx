'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Target, Trash2, Search, Plus, X, ChevronDown, ChevronUp,
  StickyNote, TrendingUp, RefreshCw,
} from 'lucide-react';
import { GradeChip } from '@/components/GradeChip';
import { EmptyState } from '@/components/EmptyState';
import { projectsApi, getErrorMessage } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { Project } from '@/types';

type Priority = 'high' | 'medium' | 'low';

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; dot: string }> = {
  high:   { label: 'High',   color: 'text-red-600 dark:text-red-400',     dot: 'bg-red-500' },
  medium: { label: 'Medium', color: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
  low:    { label: 'Low',    color: 'text-stone-400',                      dot: 'bg-stone-300' },
};

function EditNotesSheet({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [notes, setNotes]       = useState(project.notes || '');
  const [priority, setPriority] = useState<Priority>(project.priority);

  const mut = useMutation({
    mutationFn: () => projectsApi.update(project.id, { notes, priority }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['projects'] }); onClose(); },
  });

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-stone-900 rounded-t-3xl p-6 space-y-4 max-w-2xl w-full mx-auto">
        <div className="w-10 h-1 bg-stone-200 dark:bg-stone-700 rounded-full mx-auto mb-2" />
        <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50">{project.route?.name}</h3>

        <div className="space-y-1">
          <label className="label">Priority</label>
          <div className="flex gap-2">
            {(['high', 'medium', 'low'] as Priority[]).map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={cn(
                  'flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all',
                  priority === p
                    ? 'border-rock-600 bg-rock-50 dark:bg-rock-900/20 text-rock-700 dark:text-rock-400'
                    : 'border-stone-200 dark:border-stone-700 text-stone-500',
                )}
              >
                <span className={cn('inline-block w-2 h-2 rounded-full mr-1.5 align-middle', PRIORITY_CONFIG[p].dot)} />
                {PRIORITY_CONFIG[p].label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <label className="label">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full input resize-none"
            placeholder="Beta, conditions, what to work on…"
          />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 btn-secondary py-3">Cancel</button>
          <button
            onClick={() => mut.mutate()}
            disabled={mut.isPending}
            className="flex-1 btn-primary py-3"
          >
            {mut.isPending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectRow({
  project,
  onDelete,
  onEdit,
  onTickNow,
}: {
  project: Project;
  onDelete: () => void;
  onEdit: () => void;
  onTickNow: () => void;
}) {
  const qc = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const cfg = PRIORITY_CONFIG[project.priority];

  const attemptMut = useMutation({
    mutationFn: () => projectsApi.incrementAttempt(project.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });

  const routeName = project.route?.name ?? '—';
  const grade     = project.route?.grade ?? '';
  const gradeSystem = project.route?.gradeSystem;
  const cragName  = project.route?.buttress?.crag?.name ?? '';

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <div className={cn('w-2.5 h-2.5 rounded-full shrink-0 mt-0.5', cfg.dot)} />

        <div className="flex-1 min-w-0" onClick={() => setExpanded((e) => !e)}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-stone-900 dark:text-stone-50 text-sm truncate">{routeName}</span>
            {grade && <GradeChip grade={grade} gradeSystem={gradeSystem as any} size="sm" />}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            {cragName && <p className="text-xs text-stone-400 truncate">{cragName}</p>}
            {project.attempts > 0 && (
              <span className="text-xs text-stone-400">
                · {project.attempts} attempt{project.attempts !== 1 ? 's' : ''}
                {project.lastAttempted ? ` · last ${project.lastAttempted}` : ''}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => setExpanded((e) => !e)}
          className="w-7 h-7 flex items-center justify-center text-stone-400 shrink-0"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-stone-50 dark:border-stone-800 pt-3">
          {project.notes && (
            <p className="text-sm text-stone-600 dark:text-stone-300 whitespace-pre-wrap">{project.notes}</p>
          )}

          {/* Attempt counter */}
          <div className="flex items-center justify-between bg-stone-50 dark:bg-stone-800/50 rounded-xl px-3 py-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-sm text-stone-600 dark:text-stone-300">
                {project.attempts} attempt{project.attempts !== 1 ? 's' : ''}
              </span>
              {project.attempts >= 5 && (
                <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-semibold">
                  Nearing send?
                </span>
              )}
            </div>
            <button
              onClick={() => attemptMut.mutate()}
              disabled={attemptMut.isPending}
              className="flex items-center gap-1 text-xs font-semibold text-rock-600 dark:text-rock-400 hover:text-rock-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> +1
            </button>
          </div>

          <div className="flex gap-2">
            <button onClick={onTickNow} className="flex-1 btn-primary py-2.5 text-sm">
              <Target className="w-4 h-4" /> Log ascent
            </button>
            <button onClick={onEdit} className="btn-secondary px-3 py-2.5">
              <StickyNote className="w-4 h-4" />
            </button>
            <button onClick={onDelete} className="btn-danger px-3 py-2.5">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [search, setSearch]       = useState('');
  const [editTarget, setEditTarget] = useState<Project | null>(null);
  const [filter, setFilter]       = useState<Priority | ''>('');

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.list,
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => projectsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });

  const handleTickNow = (p: Project) => {
    const params = new URLSearchParams();
    if (p.routeId) params.set('routeId', p.routeId);
    const cragId = p.route?.buttress?.crag?.id;
    if (cragId) params.set('cragId', cragId);
    router.push(`/log?${params.toString()}`);
  };

  const filtered = (projects as Project[])
    .filter((p) =>
      (!filter || p.priority === filter) &&
      (!search || (p.route?.name || '').toLowerCase().includes(search.toLowerCase()) ||
                  (p.route?.buttress?.crag?.name || '').toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const order: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
      return order[a.priority] - order[b.priority];
    });

  const counts: Record<Priority, number> = { high: 0, medium: 0, low: 0 };
  (projects as Project[]).forEach((p) => counts[p.priority]++);

  if (isLoading) {
    return (
      <div className="space-y-3 animate-fade-in">
        {[1, 2, 3].map((i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50">Projects</h1>
          <p className="text-sm text-stone-400 mt-0.5">
            {(projects as Project[]).length} route{(projects as Project[]).length !== 1 ? 's' : ''} on the list
          </p>
        </div>
        <button onClick={() => router.push('/crags')} className="btn-primary py-2.5 px-4 text-sm">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {(projects as Project[]).length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {(['high', 'medium', 'low'] as Priority[]).map((p) => {
            const cfg = PRIORITY_CONFIG[p];
            return (
              <button
                key={p}
                onClick={() => setFilter(filter === p ? '' : p)}
                className={cn(
                  'rounded-2xl p-3 text-center border-2 transition-all',
                  filter === p
                    ? 'border-rock-600 bg-rock-50 dark:bg-rock-900/20'
                    : 'bg-white dark:bg-stone-900 border-stone-100 dark:border-stone-800',
                )}
              >
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <span className={cn('w-2 h-2 rounded-full', cfg.dot)} />
                  <span className={cn('text-xs font-semibold', cfg.color)}>{cfg.label}</span>
                </div>
                <p className="text-xl font-bold text-stone-900 dark:text-stone-50">{counts[p]}</p>
              </button>
            );
          })}
        </div>
      )}

      {(projects as Project[]).length > 0 && (
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
            placeholder="Search projects…"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-stone-400" />
            </button>
          )}
        </div>
      )}

      {(projects as Project[]).length === 0 ? (
        <EmptyState
          icon={<Target className="w-8 h-8" />}
          title="No projects yet"
          body="Add routes you want to climb. Browse crags to find your next challenge."
          cta="Explore crags"
          ctaHref="/crags"
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="w-8 h-8" />}
          title="No matches"
          body="Try a different search term or clear the filter."
          cta="Clear"
          ctaOnClick={() => { setSearch(''); setFilter(''); }}
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((p) => (
            <ProjectRow
              key={p.id}
              project={p}
              onDelete={() => deleteMut.mutate(p.id)}
              onEdit={() => setEditTarget(p)}
              onTickNow={() => handleTickNow(p)}
            />
          ))}
        </div>
      )}

      {editTarget && (
        <EditNotesSheet
          project={editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}
    </div>
  );
}
