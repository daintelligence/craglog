'use client';
import { useState } from 'react';
import { Mountain, BookOpen, Map, Wifi, ChevronRight, Check } from 'lucide-react';
import { markOnboarded } from '@/lib/sessionStore';
import { cn } from '@/lib/utils';

const SLIDES = [
  {
    icon: Mountain,
    color: 'from-rock-600 to-rock-800',
    title: 'Welcome to CragLog',
    body: 'Your climbing logbook, built for UK routes. Log every ascent — from moorland gritstone to sea cliffs.',
  },
  {
    icon: BookOpen,
    color: 'from-emerald-600 to-emerald-800',
    title: 'Log in seconds',
    body: 'Find your crag, pick a route, tap your style. Set a session so you can log multiple routes without retyping.',
  },
  {
    icon: Map,
    color: 'from-sky-600 to-sky-800',
    title: 'Explore 500+ crags',
    body: 'From Stanage to Gogarth, Dumbarton to Portland. Browse by region or let GPS find what\'s nearby.',
  },
  {
    icon: Wifi,
    color: 'from-amber-600 to-amber-800',
    title: 'Works offline',
    body: 'Log ascents even without signal. They\'ll sync the next time you\'re connected.',
  },
];

export function Onboarding({ onDone }: { onDone: () => void }) {
  const [idx, setIdx] = useState(0);
  const isLast = idx === SLIDES.length - 1;
  const slide = SLIDES[idx];
  const Icon = slide.icon;

  const next = () => {
    if (isLast) {
      markOnboarded();
      onDone();
    } else {
      setIdx((i) => i + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-stone-950 flex flex-col">
      {/* slide area */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">
        <div className={cn('w-24 h-24 rounded-3xl bg-gradient-to-br flex items-center justify-center shadow-lg animate-bounce-in', slide.color)}>
          <Icon className="w-12 h-12 text-white" />
        </div>

        <div className="text-center space-y-3 animate-slide-up">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50">{slide.title}</h1>
          <p className="text-base text-stone-500 dark:text-stone-400 leading-relaxed max-w-xs mx-auto">
            {slide.body}
          </p>
        </div>
      </div>

      {/* dot indicators */}
      <div className="flex items-center justify-center gap-2 pb-4">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={cn(
              'rounded-full transition-all duration-300',
              i === idx
                ? 'w-6 h-2 bg-rock-600'
                : 'w-2 h-2 bg-stone-200 dark:bg-stone-700',
            )}
          />
        ))}
      </div>

      {/* CTA */}
      <div className="px-6 pb-10 space-y-3">
        <button
          onClick={next}
          className="w-full btn-primary py-4 text-base"
        >
          {isLast ? (
            <>
              <Check className="w-5 h-5" />
              Get started
            </>
          ) : (
            <>
              Next
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>

        {!isLast && (
          <button
            onClick={() => { markOnboarded(); onDone(); }}
            className="w-full text-sm text-stone-400 dark:text-stone-500 py-2"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
