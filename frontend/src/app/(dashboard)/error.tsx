'use client';
import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[CragLog]', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h2 className="text-xl font-bold text-stone-900 dark:text-stone-50 mb-2">
        Something went wrong
      </h2>
      <p className="text-stone-500 dark:text-stone-400 text-sm mb-6 max-w-xs">
        An unexpected error occurred. Your climbs are safe — try refreshing.
      </p>
      <div className="flex gap-3">
        <button onClick={reset} className="btn-primary flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
        <Link href="/dashboard" className="btn-secondary flex items-center gap-2">
          <Home className="w-4 h-4" />
          Go home
        </Link>
      </div>
    </div>
  );
}
