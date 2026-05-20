'use client';
import { useState, useMemo } from 'react';
import { BadgeShield, TIER_LABEL } from '@/components/BadgeShield';
import type { BadgeTier } from '@/types';
import { Share2, X, ChevronRight } from 'lucide-react';

export interface EarnedBadge {
  id: string;
  name: string;
  description: string;
  tier: string;
  icon: string;
}

interface Props {
  badges: EarnedBadge[];
  onDismiss: () => void;
  onShare: (badge: EarnedBadge) => void;
}

const CONFETTI_COLORS = ['#f59e0b', '#ef4444', '#10b981', '#6366f1', '#ec4899', '#06b6d4', '#f97316'];

export function BadgeCelebration({ badges, onDismiss, onShare }: Props) {
  const [idx, setIdx] = useState(0);
  const badge = badges[idx];

  const pieces = useMemo(() =>
    Array.from({ length: 32 }, (_, i) => ({
      id: i,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      left: (i * 3.19 + 5) % 100,
      delay: (i * 0.071) % 0.9,
      size: 5 + (i % 5) * 2,
      dur: 1.6 + (i % 4) * 0.3,
      circle: i % 3 !== 0,
    })),
  []);

  if (!badge) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onDismiss} />

      {/* Confetti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {pieces.map((p) => (
          <div
            key={p.id}
            className="absolute confetti-piece"
            style={{
              top: -20,
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: p.circle ? '50%' : '2px',
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
            }}
          />
        ))}
      </div>

      {/* Card */}
      <div className="relative z-10 mx-5 max-w-xs w-full bg-white dark:bg-stone-900 rounded-3xl p-7 text-center shadow-2xl animate-badge-pop">
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {badges.length > 1 && (
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">
            {idx + 1} of {badges.length}
          </p>
        )}

        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-4">
          Badge unlocked
        </p>

        <div className="flex justify-center mb-5 animate-bounce-in">
          <BadgeShield tier={badge.tier as BadgeTier} icon={badge.icon} size="lg" />
        </div>

        <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5"
          style={{ color: badge.tier === 'gold' ? '#b45309' : badge.tier === 'platinum' ? '#7c3aed' : badge.tier === 'silver' ? '#64748b' : '#92400e' }}>
          {TIER_LABEL[badge.tier as BadgeTier] ?? badge.tier}
        </p>
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-50 mb-1.5">{badge.name}</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed mb-6">{badge.description}</p>

        <div className="flex gap-2.5">
          <button
            onClick={() => onShare(badge)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-sm font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          {idx < badges.length - 1 ? (
            <button
              onClick={() => setIdx(idx + 1)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-rock-600 text-white text-sm font-semibold hover:bg-rock-700 transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onDismiss}
              className="flex-1 py-2.5 rounded-xl bg-rock-600 text-white text-sm font-semibold hover:bg-rock-700 transition-colors"
            >
              Awesome!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
