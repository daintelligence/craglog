'use client';
import {
  Mountain, Trophy, Flame, Star, Map, Zap, Eye, Settings,
  Layers, MapPin, List, Shuffle, Award, Target, Compass, Dumbbell,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BadgeTier } from '@/types';

const ICON_MAP: Record<string, React.ElementType> = {
  mountain:  Mountain,
  trophy:    Trophy,
  flame:     Flame,
  star:      Star,
  map:       Map,
  bolt:      Zap,
  zap:       Zap,
  eye:       Eye,
  gear:      Settings,
  layers:    Layers,
  'map-pin': MapPin,
  list:      List,
  shuffle:   Shuffle,
  target:    Target,
  compass:   Compass,
  dumbbell:  Dumbbell,
};

const TIER_STYLES: Record<BadgeTier, { gradient: string; shadow: string; label: string; ring: string }> = {
  bronze: {
    gradient: 'linear-gradient(145deg, #e8a060 0%, #c07030 45%, #8c4818 100%)',
    shadow:   'drop-shadow(0 4px 8px rgba(160, 80, 20, 0.55))',
    label:    'text-orange-700 dark:text-orange-400',
    ring:     'rgba(200, 120, 40, 0.35)',
  },
  silver: {
    gradient: 'linear-gradient(145deg, #f0f3f6 0%, #c0ccd8 45%, #8090a4 100%)',
    shadow:   'drop-shadow(0 4px 8px rgba(100, 120, 150, 0.5))',
    label:    'text-slate-500 dark:text-slate-300',
    ring:     'rgba(160, 180, 210, 0.35)',
  },
  gold: {
    gradient: 'linear-gradient(145deg, #ffe878 0%, #e89820 45%, #b06008 100%)',
    shadow:   'drop-shadow(0 5px 10px rgba(210, 140, 10, 0.65))',
    label:    'text-amber-600 dark:text-amber-400',
    ring:     'rgba(240, 180, 20, 0.4)',
  },
  platinum: {
    gradient: 'linear-gradient(145deg, #e8d8ff 0%, #a060e8 30%, #40b8f0 65%, #e050b0 100%)',
    shadow:   'drop-shadow(0 6px 12px rgba(140, 60, 220, 0.65))',
    label:    'text-violet-600 dark:text-violet-400',
    ring:     'rgba(160, 80, 240, 0.4)',
  },
};

// Classic heraldic shield: flat top with chamfered corners, pointed bottom
const SHIELD_PATH = 'polygon(12% 0%, 88% 0%, 100% 18%, 100% 60%, 50% 100%, 0% 60%, 0% 18%)';

const SIZE = {
  sm: { w: 44,  iconW: 18, labelCls: 'text-[9px] max-w-[52px]'  },
  md: { w: 56,  iconW: 22, labelCls: 'text-[10px] max-w-[64px]' },
  lg: { w: 72,  iconW: 28, labelCls: 'text-xs max-w-[80px]'     },
};

export function BadgeShield({
  tier,
  icon,
  name,
  size = 'md',
  className,
}: {
  tier: BadgeTier;
  icon: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const ts  = TIER_STYLES[tier] ?? TIER_STYLES.bronze;
  const dim = SIZE[size];
  const Icon = ICON_MAP[icon] ?? Award;
  const h   = Math.round(dim.w * 1.18);

  return (
    <div className={cn('flex flex-col items-center gap-1.5', className)}>
      {/* Wrapper carries the drop-shadow so it renders outside the clip boundary */}
      <div style={{ filter: ts.shadow, padding: 6 }}>
        <div
          style={{
            width:       dim.w,
            height:      h,
            background:  ts.gradient,
            clipPath:    SHIELD_PATH,
            display:     'flex',
            alignItems:  'center',
            justifyContent: 'center',
            paddingBottom: Math.round(h * 0.16),
          }}
        >
          <Icon
            style={{ width: dim.iconW, height: dim.iconW }}
            className="text-white/95 drop-shadow-sm"
            strokeWidth={2.5}
          />
        </div>
      </div>
      {name && (
        <p className={cn(
          'text-center font-semibold text-stone-600 dark:text-stone-400 leading-tight',
          dim.labelCls,
        )}>
          {name}
        </p>
      )}
    </div>
  );
}

export const TIER_ORDER: BadgeTier[] = ['platinum', 'gold', 'silver', 'bronze'];

export const TIER_LABEL: Record<BadgeTier, string> = {
  platinum: 'Platinum',
  gold:     'Gold',
  silver:   'Silver',
  bronze:   'Bronze',
};
