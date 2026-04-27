'use client';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { feedbackApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Send, CheckCircle2, MessageSquare, Lightbulb, Heart, HelpCircle, Star } from 'lucide-react';

type Category = 'bug' | 'idea' | 'praise' | 'other';

const CATEGORIES: { value: Category; label: string; emoji: string; placeholder: string }[] = [
  { value: 'bug',    label: 'Bug',    emoji: '🐛', placeholder: 'Describe what went wrong and how to reproduce it…' },
  { value: 'idea',   label: 'Idea',   emoji: '💡', placeholder: 'What feature or change would make CragLog better?' },
  { value: 'praise', label: 'Praise', emoji: '🙌', placeholder: 'What do you love about CragLog?' },
  { value: 'other',  label: 'Other',  emoji: '💬', placeholder: 'Tell us anything…' },
];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  bug: HelpCircle, idea: Lightbulb, praise: Heart, other: MessageSquare,
};

const CATEGORY_COLOURS: Record<string, string> = {
  bug: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  idea: 'bg-summit-100 text-summit-700 dark:bg-summit-900/30 dark:text-summit-400',
  praise: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  other: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400',
};

export default function FeedbackPage() {
  const qc = useQueryClient();
  const [category, setCategory] = useState<Category>('idea');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHover] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const { data: history = [], isLoading: historyLoading } = useQuery({
    queryKey: ['feedback-mine'],
    queryFn: feedbackApi.mine,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    try {
      await feedbackApi.submit({
        category,
        message: message.trim(),
        rating: rating ?? undefined,
        context: typeof window !== 'undefined' ? window.location.pathname : undefined,
      });
      setDone(true);
      qc.invalidateQueries({ queryKey: ['feedback-mine'] });
      setTimeout(() => {
        setDone(false);
        setMessage('');
        setRating(null);
        setCategory('idea');
      }, 3000);
    } finally {
      setLoading(false);
    }
  }

  const activeCat = CATEGORIES.find((c) => c.value === category)!;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-stone-900 dark:text-stone-50">Share feedback</h1>
        <p className="text-sm text-stone-500 mt-0.5">Help shape CragLog — every message is read.</p>
      </div>

      {/* Submission form */}
      <div className="card p-5">
        {done ? (
          <div className="py-8 flex flex-col items-center gap-3 text-center">
            <CheckCircle2 className="w-12 h-12 text-summit-500" />
            <p className="font-bold text-stone-900 dark:text-stone-50">Thanks — feedback received!</p>
            <p className="text-sm text-stone-500">We'll use it to keep improving CragLog.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category */}
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  className={cn(
                    'flex flex-col items-center gap-1 py-3 rounded-2xl border text-xs font-semibold transition-all',
                    category === c.value
                      ? 'bg-summit-50 dark:bg-summit-900/30 border-summit-400 text-summit-700 dark:text-summit-300'
                      : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-500 hover:border-stone-300',
                  )}
                >
                  <span className="text-lg">{c.emoji}</span>
                  {c.label}
                </button>
              ))}
            </div>

            {/* Message */}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              maxLength={2000}
              required
              placeholder={activeCat.placeholder}
              className="w-full rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-50 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-summit-400/50 placeholder:text-stone-400"
            />

            {/* Star rating */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-stone-500 font-medium">Overall rating</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => setRating(rating === n ? null : n)}
                    className="p-0.5 transition-transform hover:scale-110"
                  >
                    <Star
                      className={cn(
                        'w-5 h-5 transition-colors',
                        n <= (hoverRating ?? rating ?? 0)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-300 dark:text-stone-600',
                      )}
                    />
                  </button>
                ))}
              </div>
              {rating && <span className="text-xs text-stone-400">{rating}/5</span>}
            </div>

            <button
              type="submit"
              disabled={!message.trim() || loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <Send className="w-4 h-4" />}
              {loading ? 'Sending…' : 'Send feedback'}
            </button>
          </form>
        )}
      </div>

      {/* Past submissions */}
      {(historyLoading || (history as any[]).length > 0) && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wide">
            Your previous feedback
          </h2>

          {historyLoading && (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="card p-4 animate-pulse space-y-2">
                  <div className="h-3 bg-stone-200 dark:bg-stone-700 rounded w-1/4" />
                  <div className="h-3 bg-stone-100 dark:bg-stone-800 rounded w-3/4" />
                </div>
              ))}
            </div>
          )}

          {!historyLoading && (history as any[]).map((item: any) => {
            const Icon = CATEGORY_ICONS[item.category] ?? MessageSquare;
            return (
              <div key={item.id} className={cn('card p-4 space-y-1.5', item.resolved && 'opacity-60')}>
                <div className="flex items-center justify-between gap-2">
                  <span className={cn('inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full capitalize', CATEGORY_COLOURS[item.category])}>
                    <Icon className="w-3 h-3" />
                    {item.category}
                  </span>
                  <div className="flex items-center gap-2">
                    {item.rating != null && (
                      <span className="flex items-center gap-0.5 text-xs text-amber-600">
                        <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                        {item.rating}/5
                      </span>
                    )}
                    {item.resolved && (
                      <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" /> Addressed
                      </span>
                    )}
                    <span className="text-xs text-stone-400">{formatDate(item.createdAt)}</span>
                  </div>
                </div>
                <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">{item.message}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
