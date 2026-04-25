'use client';
import { useQuery } from '@tanstack/react-query';
import { badgesApi } from '@/lib/api';
import { Loader2, Lock } from 'lucide-react';
import type { BadgeDefinition, BadgeTier } from '@/types';
import { BADGE_TIER_COLORS } from '@/types';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

const BADGE_ICONS: Record<string, string> = {
  mountain: '⛰️', trophy: '🏆', gear: '⚙️', bolt: '⚡', eye: '👁️',
  map: '🗺️', star: '⭐', flame: '🔥', layers: '📚', shuffle: '🔀',
  zap: '⚡', 'map-pin': '📍', list: '📋', default: '🏅',
};

const TIER_ORDER: BadgeTier[] = ['gold', 'silver', 'bronze'];
const TIER_LABELS: Record<BadgeTier, string> = {
  gold: 'Gold', silver: 'Silver', bronze: 'Bronze', platinum: 'Platinum',
};

export default function BadgesPage() {
  const { data: allBadges = [], isLoading: allLoading } = useQuery({
    queryKey: ['badges', 'all'],
    queryFn: badgesApi.all,
  });
  const { data: earnedBadges = [], isLoading: earnedLoading } = useQuery({
    queryKey: ['badges', 'mine'],
    queryFn: badgesApi.mine,
  });

  const earnedMap = new Map<string, string>(
    earnedBadges.map((ub: any) => [ub.badge.id, ub.earnedAt]),
  );

  const totalEarned = earnedBadges.length;
  const totalBadges = allBadges.length;

  if (allLoading || earnedLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-rock-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">Badges</h1>
        <span className="text-sm text-stone-500">
          <span className="font-semibold text-stone-900">{totalEarned}</span> / {totalBadges} earned
        </span>
      </div>

      {/* Progress bar */}
      <div>
        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rock-500 to-amber-500 rounded-full transition-all"
            style={{ width: `${totalBadges > 0 ? (totalEarned / totalBadges) * 100 : 0}%` }}
          />
        </div>
        <p className="text-xs text-stone-400 mt-1.5 text-right">
          {Math.round((totalEarned / Math.max(totalBadges, 1)) * 100)}% complete
        </p>
      </div>

      {/* Badges by tier */}
      {TIER_ORDER.map((tier) => {
        const tierBadges = allBadges.filter((b: BadgeDefinition) => b.tier === tier);
        if (!tierBadges.length) return null;

        return (
          <div key={tier}>
            <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3">
              {TIER_LABELS[tier]} ({tierBadges.filter((b: BadgeDefinition) => earnedMap.has(b.id)).length}/{tierBadges.length})
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {tierBadges.map((badge: BadgeDefinition) => {
                const earnedAt = earnedMap.get(badge.id);
                const earned = !!earnedAt;
                return (
                  <div
                    key={badge.id}
                    className={cn(
                      'card p-4 transition-all',
                      earned ? 'border-stone-200 shadow-sm' : 'opacity-50 grayscale',
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm shrink-0',
                        earned
                          ? `bg-gradient-to-br ${BADGE_TIER_COLORS[tier]}`
                          : 'bg-stone-100',
                        earned && 'animate-none',
                      )}>
                        {earned
                          ? (BADGE_ICONS[badge.icon] || BADGE_ICONS.default)
                          : <Lock className="w-5 h-5 text-stone-400" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-stone-900 text-sm leading-tight">{badge.name}</p>
                        <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{badge.description}</p>
                        {earned && earnedAt && (
                          <p className="text-xs text-rock-500 mt-1 font-medium">{formatDate(earnedAt)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
