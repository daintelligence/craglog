'use client';
import { useState, useRef, useEffect } from 'react';
import { MessageSquarePlus, X, Star, Send, CheckCircle2, ChevronDown } from 'lucide-react';
import { feedbackApi } from '@/lib/api';
import { cn } from '@/lib/utils';

type Category = 'bug' | 'idea' | 'praise' | 'other';

const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
  { value: 'bug',    label: 'Bug',       emoji: '🐛' },
  { value: 'idea',   label: 'Idea',      emoji: '💡' },
  { value: 'praise', label: 'Praise',    emoji: '🙌' },
  { value: 'other',  label: 'Other',     emoji: '💬' },
];

export function FeedbackWidget() {
  const [open, setOpen]           = useState(false);
  const [category, setCategory]   = useState<Category>('idea');
  const [message, setMessage]     = useState('');
  const [rating, setRating]       = useState<number | null>(null);
  const [hoverRating, setHover]   = useState<number | null>(null);
  const [loading, setLoading]     = useState(false);
  const [done, setDone]           = useState(false);
  const textareaRef               = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 300);
    }
  }, [open]);

  function reset() {
    setCategory('idea');
    setMessage('');
    setRating(null);
    setHover(null);
    setDone(false);
  }

  function handleClose() {
    setOpen(false);
    setTimeout(reset, 400);
  }

  async function handleSubmit() {
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
      setTimeout(handleClose, 2200);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating trigger button — sits just above the bottom nav */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Send feedback"
        className={cn(
          'fixed right-4 z-50 w-11 h-11 rounded-full shadow-lg',
          'bg-summit-600 hover:bg-summit-700 active:scale-95',
          'flex items-center justify-center transition-all duration-200',
          'bottom-[76px]',
        )}
      >
        <MessageSquarePlus className="w-5 h-5 text-white" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[900] bg-black/40 backdrop-blur-[2px]"
          onClick={handleClose}
        />
      )}

      {/* Bottom sheet */}
      <div
        className={cn(
          'fixed left-0 right-0 bottom-0 z-[901] transition-transform duration-300 ease-out',
          open ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <div className="bg-white dark:bg-stone-900 rounded-t-3xl shadow-2xl border-t border-stone-100 dark:border-stone-800 max-w-2xl mx-auto">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-stone-200 dark:bg-stone-700 rounded-full" />
          </div>

          <div className="px-5 pb-8 pt-2">
            {done ? (
              <div className="py-10 flex flex-col items-center gap-3 text-center">
                <CheckCircle2 className="w-12 h-12 text-summit-500" />
                <h3 className="font-bold text-stone-900 dark:text-stone-50 text-lg">Thanks for your feedback!</h3>
                <p className="text-sm text-stone-500 dark:text-stone-400">We'll use it to keep improving CragLog.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-stone-900 dark:text-stone-50 text-base">Share feedback</h3>
                  <button
                    onClick={handleClose}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-800"
                  >
                    <X className="w-4 h-4 text-stone-500" />
                  </button>
                </div>

                {/* Category chips */}
                <div className="flex gap-2 mb-4">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setCategory(c.value)}
                      className={cn(
                        'flex-1 flex flex-col items-center gap-1 py-2.5 rounded-2xl border text-xs font-semibold transition-all',
                        category === c.value
                          ? 'bg-summit-50 dark:bg-summit-900/30 border-summit-400 text-summit-700 dark:text-summit-300'
                          : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400',
                      )}
                    >
                      <span className="text-base">{c.emoji}</span>
                      {c.label}
                    </button>
                  ))}
                </div>

                {/* Message */}
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  maxLength={2000}
                  placeholder={
                    category === 'bug'    ? "Describe what went wrong…" :
                    category === 'idea'   ? "What would make CragLog better?" :
                    category === 'praise' ? "What do you love about CragLog?" :
                    "Tell us anything…"
                  }
                  className="w-full rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-50 px-3.5 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-summit-400/50 placeholder:text-stone-400 mb-4"
                />

                {/* Star rating */}
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-xs text-stone-400 font-medium">Overall rating</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
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
                  {rating && (
                    <span className="text-xs text-stone-400">{rating}/5</span>
                  )}
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={!message.trim() || loading}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {loading ? 'Sending…' : 'Send feedback'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
