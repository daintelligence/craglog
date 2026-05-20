'use client';
import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Share2, Download, X } from 'lucide-react';
import { BadgeShield } from '@/components/BadgeShield';
import type { BadgeTier } from '@/types';

// ── Data types ────────────────────────────────────────────────────────────────

export type ShareData =
  | { type: 'ascent'; routeName: string; grade: string; ascentType: string; cragName: string; date: string }
  | { type: 'badge'; badge: { id: string; name: string; description: string; tier: string; icon: string } }
  | { type: 'session'; cragName: string; routeCount: number; topGrade: string; flashes: number; date: string };

// ── Shared card constants ─────────────────────────────────────────────────────

const CARD = 360;
const FONT = `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

const ASCENT_COLORS: Record<string, string> = {
  onsight: '#10b981', flash: '#0ea5e9', redpoint: '#ef4444',
  pinkpoint: '#ec4899', dog: '#9ca3af', repeat: '#6b7280', second: '#818cf8',
};
const ASCENT_LABELS: Record<string, string> = {
  onsight: 'Onsight', flash: 'Flash', redpoint: 'Redpoint',
  pinkpoint: 'Pinkpoint', dog: 'Working', repeat: 'Repeat', second: 'Second',
};
const TIER_BG: Record<string, string> = {
  bronze:   'linear-gradient(135deg, #c4832a 0%, #7c3813 100%)',
  silver:   'linear-gradient(135deg, #d8e0ea 0%, #7a8fa8 100%)',
  gold:     'linear-gradient(135deg, #f0c030 0%, #a06010 100%)',
  platinum: 'linear-gradient(135deg, #b070f0 0%, #40b8f0 55%, #e050b0 100%)',
};
const DARK_BG = 'linear-gradient(140deg, #1c1917 0%, #292524 55%, #1a1614 100%)';
const DOTS = {
  position: 'absolute' as const, inset: 0, opacity: 0.04,
  backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};
const LOGO = (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <div style={{ width: 24, height: 24, background: 'rgba(255,255,255,0.15)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>▲</span>
    </div>
    <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 700, letterSpacing: '0.05em' }}>CragLog</span>
  </div>
);

// ── Card components ───────────────────────────────────────────────────────────

function AscentCard({ routeName, grade, ascentType, cragName, date }: Omit<Extract<ShareData, { type: 'ascent' }>, 'type'>) {
  const accent = ASCENT_COLORS[ascentType] ?? '#6d5035';
  const label  = ASCENT_LABELS[ascentType] ?? ascentType;
  return (
    <div style={{ width: CARD, height: CARD, background: DARK_BG, fontFamily: FONT, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '28px 28px 24px', overflow: 'hidden' }}>
      <div style={DOTS} />
      {/* accent stripe */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, backgroundColor: accent }} />

      {/* Top */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {LOGO}
        {grade && (
          <div style={{ backgroundColor: accent, color: '#fff', fontSize: 13, fontWeight: 800, padding: '5px 12px', borderRadius: 20 }}>
            {grade}
          </div>
        )}
      </div>

      {/* Centre */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 8 }}>
        <p style={{ color: '#fff', fontSize: routeName.length > 20 ? 24 : 30, fontWeight: 800, lineHeight: 1.2, margin: 0, letterSpacing: '-0.02em' }}>
          {routeName || 'Unknown route'}
        </p>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 8, fontWeight: 500, margin: '8px 0 0' }}>
          {cragName}
        </p>
      </div>

      {/* Bottom */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 8 }}>
        <div style={{ backgroundColor: accent + '33', color: accent, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 12, letterSpacing: '0.04em', textTransform: 'uppercase' as const }}>
          {label}
        </div>
        <div style={{ textAlign: 'right' as const }}>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, margin: 0, fontWeight: 500 }}>craglog.cloud</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: '2px 0 0' }}>{date}</p>
        </div>
      </div>
    </div>
  );
}

function BadgeCard({ badge }: { badge: Extract<ShareData, { type: 'badge' }>['badge'] }) {
  const bg = TIER_BG[badge.tier] ?? TIER_BG.bronze;
  return (
    <div style={{ width: CARD, height: CARD, background: bg, fontFamily: FONT, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.2, background: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.8) 0%, transparent 60%)' }} />
      <div style={{ marginBottom: 20 }}>
        <BadgeShield tier={badge.tier as BadgeTier} icon={badge.icon} size="lg" />
      </div>
      <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' as const, margin: '0 0 6px' }}>Achievement unlocked</p>
      <p style={{ color: '#fff', fontSize: 22, fontWeight: 800, textAlign: 'center' as const, margin: '0 0 6px', letterSpacing: '-0.02em' }}>{badge.name}</p>
      <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, textAlign: 'center' as const, margin: '0 0 0', maxWidth: 260, lineHeight: 1.4 }}>{badge.description}</p>
      <p style={{ position: 'absolute', bottom: 20, color: 'rgba(255,255,255,0.4)', fontSize: 11, letterSpacing: '0.05em', margin: 0 }}>craglog.cloud</p>
    </div>
  );
}

function SessionCard({ cragName, routeCount, topGrade, flashes, date }: Omit<Extract<ShareData, { type: 'session' }>, 'type'>) {
  const stats = [
    { value: routeCount, label: routeCount === 1 ? 'route' : 'routes' },
    { value: topGrade || '—', label: 'top grade' },
    { value: flashes, label: flashes === 1 ? 'flash' : 'flashes' },
  ];
  return (
    <div style={{ width: CARD, height: CARD, background: DARK_BG, fontFamily: FONT, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '28px', position: 'relative', overflow: 'hidden' }}>
      <div style={DOTS} />
      {LOGO}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: '0 0 4px', fontWeight: 500 }}>Session at</p>
          <p style={{ color: '#fff', fontSize: cragName.length > 20 ? 22 : 28, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            {cragName || 'the crag'}
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {stats.map(({ value, label }) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: '12px 8px', textAlign: 'center' as const }}>
              <p style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>{value}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, margin: '4px 0 0', fontWeight: 500 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, margin: 0, fontWeight: 500 }}>craglog.cloud</p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>{date}</p>
      </div>
    </div>
  );
}

// ── ShareModal ────────────────────────────────────────────────────────────────

interface Props {
  data: ShareData;
  onClose: () => void;
}

export function ShareModal({ data, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  async function capture(): Promise<Blob | null> {
    if (!cardRef.current) return null;
    const url = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
    return fetch(url).then((r) => r.blob());
  }

  async function handleShare() {
    setBusy(true);
    try {
      const blob = await capture();
      if (!blob) return;
      const file = new File([blob], 'craglog.png', { type: 'image/png' });
      if (typeof navigator !== 'undefined' && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'CragLog' });
        onClose();
      } else {
        doDownload(blob);
      }
    } catch {
      // user cancelled or share unsupported — fall through
    } finally {
      setBusy(false);
    }
  }

  async function handleDownload() {
    setBusy(true);
    try {
      const blob = await capture();
      if (blob) doDownload(blob);
    } finally {
      setBusy(false);
    }
  }

  function doDownload(blob: Blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'craglog.png'; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm mx-4 mb-6 bg-white dark:bg-stone-900 rounded-3xl p-5 shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-stone-900 dark:text-stone-50 text-sm">Share</h3>
          <button onClick={onClose} className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Card preview — scaled 70% to fit the modal */}
        <div className="overflow-hidden rounded-2xl mb-5 flex justify-center" style={{ height: 252 }}>
          <div style={{ transform: 'scale(0.7)', transformOrigin: 'top center', flexShrink: 0 }}>
            <div ref={cardRef}>
              {data.type === 'ascent'  && <AscentCard  {...data} />}
              {data.type === 'badge'   && <BadgeCard   badge={data.badge} />}
              {data.type === 'session' && <SessionCard {...data} />}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            disabled={busy}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-sm font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> Save image
          </button>
          <button
            onClick={handleShare}
            disabled={busy}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rock-600 text-white text-sm font-semibold hover:bg-rock-700 transition-colors disabled:opacity-50"
          >
            <Share2 className="w-4 h-4" />
            {busy ? 'Preparing…' : 'Share'}
          </button>
        </div>
      </div>
    </div>
  );
}
