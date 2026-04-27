'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard, PlusCircle, Map, BookOpen, UserCircle, Mountain,
  Wifi, WifiOff, RefreshCw, Download, X, Dumbbell,
} from 'lucide-react';
import { useOfflineQueue } from '@/hooks/useOfflineQueue';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useDarkMode } from '@/hooks/useDarkMode';
import { clearAuth, isAuthenticated } from '@/lib/auth';
import { getTheme, isOnboarded } from '@/lib/sessionStore';
import { cn } from '@/lib/utils';
import { Onboarding } from '@/components/Onboarding';
import { PageTransition } from '@/components/PageTransition';
import { FeedbackWidget } from '@/components/FeedbackWidget/FeedbackWidget';

const NAV = [
  { href: '/dashboard', label: 'Home',    icon: LayoutDashboard },
  { href: '/crags',     label: 'Explore', icon: Map },
  { href: '/log',       label: 'Log',     icon: PlusCircle, fab: true },
  { href: '/gym',       label: 'Gym',     icon: Dumbbell },
  { href: '/profile',   label: 'Profile', icon: UserCircle },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const { pendingCount, isOnline, isSyncing, sync } = useOfflineQueue();
  const { canInstall, install, dismiss }             = usePWAInstall();
  const [syncDone, setSyncDone] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!isOnboarded()) setShowOnboarding(true);
  }, []);

  // Apply stored theme immediately to avoid flash
  useEffect(() => {
    const theme = getTheme();
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) router.push('/login');
  }, [router]);

  const handleSync = async () => {
    await sync();
    setSyncDone(true);
    setTimeout(() => setSyncDone(false), 3000);
  };

  const isLogPage = pathname === '/log';

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 dark:bg-stone-950">
      {showOnboarding && <Onboarding onDone={() => setShowOnboarding(false)} />}

      {/* ── Top header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm border-b border-stone-100 dark:border-stone-800">
        <div className="max-w-2xl mx-auto px-4 h-13 flex items-center justify-between" style={{ height: 52 }}>
          <Link href="/dashboard" className="flex items-center gap-2 min-h-0">
            <Mountain className="w-5 h-5 text-rock-600" />
            <span className="text-base font-bold text-stone-900 dark:text-stone-50">CragLog</span>
          </Link>

          <div className="flex items-center gap-2">
            {!isOnline && (
              <div className="flex items-center gap-1.5 text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-2.5 py-1.5 rounded-full font-medium">
                <WifiOff className="w-3 h-3" />
                Offline
              </div>
            )}
            {isOnline && pendingCount > 0 && (
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="flex items-center gap-1.5 text-xs bg-summit-100 dark:bg-summit-900/40 text-summit-700 dark:text-summit-400 px-2.5 py-1.5 rounded-full font-medium hover:bg-summit-200 transition-colors"
              >
                <RefreshCw className={cn('w-3 h-3', isSyncing && 'animate-spin')} />
                {syncDone ? 'Synced!' : `${pendingCount} pending`}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Install prompt ─────────────────────────────────────────────── */}
      {canInstall && (
        <div className="sticky top-[52px] z-30 bg-rock-600 text-white px-4 py-3 flex items-center gap-3 animate-slide-down">
          <Download className="w-4 h-4 shrink-0" />
          <p className="text-sm font-medium flex-1">Add CragLog to your home screen</p>
          <button onClick={install} className="text-xs font-bold bg-white text-rock-600 px-3 py-1.5 rounded-xl">
            Install
          </button>
          <button onClick={dismiss} className="p-1">
            <X className="w-4 h-4 opacity-80" />
          </button>
        </div>
      )}

      {/* ── Main content ───────────────────────────────────────────────── */}
      <main className={cn(
        'flex-1 max-w-2xl mx-auto w-full px-4 pt-5',
        isLogPage ? 'pb-28' : 'pb-24',
      )}>
        <PageTransition>{children}</PageTransition>
      </main>

      <FeedbackWidget />

      {/* ── Bottom tab bar ─────────────────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-sm border-t border-stone-100 dark:border-stone-800 safe-area-pb">
        <div className="max-w-2xl mx-auto flex items-end px-2" style={{ height: 64 }}>
          {NAV.map(({ href, label, icon: Icon, fab }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

            if (fab) {
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex-1 flex flex-col items-center justify-end pb-2 -mt-6"
                >
                  <div className={cn(
                    'w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200',
                    'shadow-fab active:scale-95',
                    active
                      ? 'bg-rock-700 shadow-fab-hover scale-105'
                      : 'bg-rock-600 hover:bg-rock-700 hover:shadow-fab-hover',
                  )}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={cn(
                    'text-[10px] font-semibold mt-1',
                    active ? 'text-rock-600 dark:text-rock-400' : 'text-stone-400',
                  )}>
                    {label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center gap-0.5 pb-2 pt-1 transition-colors',
                  active
                    ? 'text-rock-600 dark:text-rock-400'
                    : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300',
                )}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {href === '/logbook' && pendingCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-500 rounded-full text-[8px] text-white font-bold flex items-center justify-center">
                      {pendingCount > 9 ? '9+' : pendingCount}
                    </span>
                  )}
                </div>
                <span className={cn(
                  'text-[10px] font-medium',
                  active ? 'font-semibold' : '',
                )}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
