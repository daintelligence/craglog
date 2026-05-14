'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle2, Circle, ChevronDown, ChevronUp, Award, Mountain } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { awardsApi } from '@/lib/api';
import { cn } from '@/lib/utils';

interface AwardSkill {
  id: string;
  label: string;
}

interface AwardProgress {
  id: string;
  scheme: 'NICAS' | 'NIBAS';
  level: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  skills: AwardSkill[];
  status: 'not_started' | 'in_progress' | 'completed';
  completedAt: string | null;
  checked: Record<string, boolean>;
  progress: { completed: number; total: number };
}

const SCHEME_COLOURS = {
  NICAS: {
    header: 'from-rock-700 to-rock-500',
    bar: 'bg-rock-500',
  },
  NIBAS: {
    header: 'from-amber-700 to-amber-500',
    bar: 'bg-amber-500',
  },
};

function AwardCard({ award, onToggleSkill }: {
  award: AwardProgress;
  onToggleSkill: (awardId: string, skillId: string, value: boolean) => void;
}) {
  const [open, setOpen] = useState(award.status === 'in_progress');
  const colours = SCHEME_COLOURS[award.scheme];
  const pct = award.progress.total > 0
    ? Math.round((award.progress.completed / award.progress.total) * 100)
    : 0;
  const isComplete = award.status === 'completed';

  return (
    <div className={cn(
      'bg-white dark:bg-stone-900 rounded-2xl border overflow-hidden transition-all',
      isComplete
        ? 'border-summit-300 dark:border-summit-700 ring-2 ring-summit-400/20'
        : 'border-stone-100 dark:border-stone-800',
    )}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
      >
        <div className={cn(
          'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br text-white',
          isComplete ? 'from-summit-500 to-summit-700' : colours.header,
        )}>
          {award.icon === 'mountain'
            ? <Mountain className="w-5 h-5" />
            : <Award className="w-5 h-5" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-stone-900 dark:text-stone-50">{award.title}</span>
            {isComplete && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-summit-100 dark:bg-summit-900/40 text-summit-700 dark:text-summit-400">
                Completed
              </span>
            )}
          </div>
          <p className="text-[11px] text-stone-400 mt-0.5">{award.subtitle}</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-300', isComplete ? 'bg-summit-500' : colours.bar)}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-[10px] text-stone-400 shrink-0 tabular-nums">
              {award.progress.completed}/{award.progress.total}
            </span>
          </div>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-stone-400 shrink-0" />
          : <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
        }
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-1 border-t border-stone-50 dark:border-stone-800 pt-3">
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">{award.description}</p>
          {award.skills.map((skill) => {
            const isChecked = !!(award.checked?.[skill.id]);
            return (
              <button
                key={skill.id}
                onClick={() => onToggleSkill(award.id, skill.id, !isChecked)}
                className="w-full flex items-start gap-2.5 py-2 px-2 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors text-left"
              >
                {isChecked
                  ? <CheckCircle2 className="w-4 h-4 text-summit-500 shrink-0 mt-0.5" />
                  : <Circle className="w-4 h-4 text-stone-300 dark:text-stone-600 shrink-0 mt-0.5" />
                }
                <span className={cn(
                  'text-sm leading-snug',
                  isChecked
                    ? 'text-stone-400 dark:text-stone-500 line-through'
                    : 'text-stone-700 dark:text-stone-200',
                )}>
                  {skill.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AwardsPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [scheme, setScheme] = useState<'NICAS' | 'NIBAS'>('NICAS');

  const { data: awards = [], isLoading } = useQuery<AwardProgress[]>({
    queryKey: ['awards-progress'],
    queryFn: awardsApi.myProgress,
  });

  const mut = useMutation({
    mutationFn: ({ awardId, skills }: { awardId: string; skills: Record<string, boolean> }) =>
      awardsApi.updateSkills(awardId, skills),
    onMutate: async ({ awardId, skills }) => {
      await qc.cancelQueries({ queryKey: ['awards-progress'] });
      const prev = qc.getQueryData<AwardProgress[]>(['awards-progress']);
      qc.setQueryData<AwardProgress[]>(['awards-progress'], (old = []) =>
        old.map((a) => a.id === awardId
          ? {
              ...a,
              checked: skills,
              progress: {
                ...a.progress,
                completed: a.skills.filter((s) => skills[s.id]).length,
              },
            }
          : a),
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(['awards-progress'], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['awards-progress'] }),
  });

  function handleToggle(awardId: string, skillId: string, value: boolean) {
    const award = awards.find((a) => a.id === awardId);
    if (!award) return;
    const current = award.checked ?? {};
    mut.mutate({ awardId, skills: { ...current, [skillId]: value } });
  }

  const filtered = awards.filter((a) => a.scheme === scheme);
  const nicasCompleted = awards.filter((a) => a.scheme === 'NICAS' && a.status === 'completed').length;
  const nibasCompleted = awards.filter((a) => a.scheme === 'NIBAS' && a.status === 'completed').length;

  return (
    <div className="space-y-4 animate-fade-in">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-stone-500 -mb-1">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header */}
      <div className="bg-gradient-to-br from-rock-700 to-rock-500 rounded-3xl p-5 text-white">
        <h1 className="text-xl font-bold">Awards & Schemes</h1>
        <p className="text-sm text-white/70 mt-1">
          Track your NICAS and NIBAS climbing award progress
        </p>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="bg-white/15 rounded-2xl p-2.5 text-center">
            <p className="text-lg font-bold">{nicasCompleted}/5</p>
            <p className="text-[10px] text-white/60">NICAS levels</p>
          </div>
          <div className="bg-white/15 rounded-2xl p-2.5 text-center">
            <p className="text-lg font-bold">{nibasCompleted}/4</p>
            <p className="text-[10px] text-white/60">NIBAS levels</p>
          </div>
        </div>
      </div>

      {/* Scheme toggle */}
      <div className="flex bg-stone-100 dark:bg-stone-800 rounded-xl p-1 gap-1">
        {(['NICAS', 'NIBAS'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setScheme(s)}
            className={cn(
              'flex-1 py-2 rounded-lg text-sm font-semibold transition-all',
              scheme === s
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-50 shadow-sm'
                : 'text-stone-400 hover:text-stone-600',
            )}
          >
            {s}
            <span className="ml-1 text-[10px] font-normal text-stone-400">
              {s === 'NICAS' ? '(Roped)' : '(Boulder)'}
            </span>
          </button>
        ))}
      </div>

      {/* Award cards */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-24 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((award) => (
            <AwardCard
              key={award.id}
              award={award}
              onToggleSkill={handleToggle}
            />
          ))}
        </div>
      )}

      {/* Info */}
      <div className="bg-stone-50 dark:bg-stone-900/50 rounded-2xl p-4 border border-stone-100 dark:border-stone-800">
        <p className="text-xs text-stone-500 leading-relaxed">
          <strong className="text-stone-700 dark:text-stone-300">NICAS</strong> (National Indoor Climbing Achievement Scheme) is the UK standard for
          indoor roped climbing across 5 levels.{' '}
          <strong className="text-stone-700 dark:text-stone-300">NIBAS</strong> covers bouldering across 4 levels.
          Awards should be verified by a qualified assessor at your climbing wall.
        </p>
      </div>
    </div>
  );
}
