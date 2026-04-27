'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feedbackApi } from '@/lib/api';
import { getStoredUser } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import { CheckCircle, MessageSquare, Lightbulb, Heart, HelpCircle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  bug: HelpCircle,
  idea: Lightbulb,
  praise: Heart,
  other: MessageSquare,
};

const CATEGORY_COLOURS: Record<string, string> = {
  bug: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  idea: 'bg-summit-100 text-summit-700 dark:bg-summit-900/30 dark:text-summit-400',
  praise: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  other: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400',
};

export default function FeedbackAdminPage() {
  const user = getStoredUser();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('open');

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-feedback'],
    queryFn: feedbackApi.list,
    enabled: !!user?.isAdmin,
  });

  const resolve = useMutation({
    mutationFn: (id: string) => feedbackApi.resolve(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-feedback'] }),
  });

  if (!user?.isAdmin) {
    return (
      <div className="py-20 text-center text-stone-500 dark:text-stone-400">
        <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p className="font-medium">Admin access required</p>
      </div>
    );
  }

  const filtered = items.filter((f: any) => {
    if (filter === 'open') return !f.resolved;
    if (filter === 'resolved') return f.resolved;
    return true;
  });

  const openCount = items.filter((f: any) => !f.resolved).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-900 dark:text-stone-50">Feedback</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            {openCount} open · {items.length} total
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl w-fit">
        {(['open', 'all', 'resolved'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors',
              filter === f
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-50 shadow-sm'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300',
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-1/4 mb-2" />
              <div className="h-3 bg-stone-100 dark:bg-stone-800 rounded w-3/4" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="py-16 text-center text-stone-400 dark:text-stone-500">
          <CheckCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium">All clear</p>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((item: any) => {
          const Icon = CATEGORY_ICONS[item.category] ?? MessageSquare;
          return (
            <div
              key={item.id}
              className={cn(
                'card p-4 space-y-2 transition-opacity',
                item.resolved && 'opacity-60',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn('inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full capitalize', CATEGORY_COLOURS[item.category])}>
                    <Icon className="w-3 h-3" />
                    {item.category}
                  </span>
                  {item.rating != null && (
                    <span className="inline-flex items-center gap-0.5 text-xs text-amber-600 font-medium">
                      <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                      {item.rating}/5
                    </span>
                  )}
                  {item.resolved && (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle className="w-3 h-3" />
                      Resolved
                    </span>
                  )}
                </div>
                <span className="text-xs text-stone-400 dark:text-stone-500 shrink-0">
                  {formatDate(item.createdAt)}
                </span>
              </div>

              <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                {item.message}
              </p>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-stone-400 dark:text-stone-500">
                  {item.user?.name ?? 'Anonymous'}
                  {item.context ? ` · ${item.context}` : ''}
                </span>
                {!item.resolved && (
                  <button
                    onClick={() => resolve.mutate(item.id)}
                    disabled={resolve.isPending}
                    className="text-xs font-medium text-rock-600 hover:text-rock-700 dark:text-rock-400 transition-colors"
                  >
                    Mark resolved
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
